<?php

namespace App\Controllers;

use App\Models\User_model;
use App\Models\MyRents_model;
use App\Models\Alquiler_model;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\I18n\Time;
use Stripe;

class StripePay extends ResourceController
{
    public function __construct()
    {
        $this->User_model = new User_model();
        $this->MyRents_model = new MyRents_model();
        $this->Alquiler_model = new Alquiler_model();
    }

    public function payment_hold(){

        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $token = $this->request->getJSON()->stripeToken;
        $user_name = $this->request->getJSON()->user_name;
        $user_id = $this->request->getJSON()->user_id;
        $email = $this->request->getJSON()->email;
        $stripeID = $this->request->getJSON()->stripeID;
        $importe = $this->request->getJSON()->importe;
        $owner_id = $this->request->getJSON()->owner_id;
        $importe = str_replace('.', '', $importe);
        $description = $this->request->getJSON()->description;

        if (is_null($stripeID)) {
            $customer = $stripe->customers->create([
                'source'   => $token,
                'email' => $email,
                'name' => $user_name
            ]);
            $stripeID = $customer->id;

            $data = [
                'stripeID' => $stripeID
            ];

            $this->User_model->update($user_id, $data);
        }

        $query = $this->User_model->select('stripe_connect_account')->find($owner_id);

        $payment_intent = $stripe->paymentIntents->create([
            "receipt_email" => $email,
            'customer' => $stripeID,
            "amount" => $importe,
            "currency" => "usd",
            "description" => $description,
            'metadata' => ['integration_check' => 'accept_a_payment'],
            'capture_method' => "manual",
            'payment_method_types' => ['card'],
            'confirm' => true,
            'transfer_data' => [
                'destination' => $query->stripe_connect_account,
            ],
        ]);

        $charges = $stripe->charges->all(["customer" => $stripeID, 'limit' => 1]);
        $stripeCardBrand = $charges->data[0]->payment_method_details->card->brand;
        $stripeCardTerminal = '**** **** ****' . $charges->data[0]->payment_method_details->card->last4;
        $stripeReceipt_url =  $charges->data[0]->receipt_url;

        return $this->respond(['stripePayID' => $payment_intent['id'], 'status' => $payment_intent['status'], 'stripeCardBrand' => $stripeCardBrand, 'stripeCardTerminal' => $stripeCardTerminal, 'stripeReceipt_url' => $stripeReceipt_url, 'stripeCustomerID' => $stripeID], 200);
    }

    public function payment(){

        /**
         * Captures the previously held money and changes the renter's status to Rented.
         * 
         */

        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $alquiler_id = $this->request->getJSON()->alquiler_id;
        $user_id = $this->request->getJSON()->user_id;
        if (!$alquiler_id) {
            return $this->respond(401);
        }

        $query = $this->Alquiler_model->find($alquiler_id);
        if (!$query) {
            return $this->respond(401);
        }
        $checkPayment = $this->getPaymentIntentsStatus($query->stripePayID);
        switch ($checkPayment->status) {

            case 'requires_capture':     
                $cargo_servicio = str_replace('.', '', $query->cargo_servicio);
                $stripe->paymentIntents->capture(
                    $query->stripePayID,
                    [
                        'application_fee_amount' => $cargo_servicio,
                    ]
                );
                if ($stripe) {
                    $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Rented']);
                }

                return $this->respond('Rented', 200);
                break;
            case 'succeeded':
                if ($stripe) {
                    $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Rented']);
                }

                return $this->respond('Rented', 200);
                break;
            case 'processing':
                return $this->respond(['message' => 'Approval is not possible, because the payment is still being processed, please try again later.'], 400);
                break;
            case 'canceled':
                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $checkPayment->canceled_at)]);
                return $this->respond(['message' => 'Approval is not possible because the payment was cancelled.', 'status' => 'canceled'], 400);
                break;
        }
    }

    public function create_connect_account() {
        $user_id = $this->request->getJSON()->user_id;
        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $consulta = $this->User_model->select('stripe_connect_account, correo, telefono')->find($user_id);
        $stripe_connect_account = $consulta->stripe_connect_account;
        if (!$stripe_connect_account) {
            $phoneNumber = str_replace('+1', '', $consulta->telefono);
            $stripe_connect_account = $stripe->accounts->create(
                [
                    'country' => 'US',
                    'type' => 'custom',
                    'email' => $consulta->correo,
                    'capabilities' => [
                        'card_payments' => ['requested' => true],
                        'transfers' => ['requested' => true],
                    ],
                    'business_type' => 'individual',
                    'business_profile' => ['url' => 'https://rentworthy.us/', 'mcc' => '7394', 'support_email' => 'support@rentworthy.us'],
                    'company' => ['phone' => $phoneNumber],
                    'metadata' => ['user_id' => $user_id]
                ]
            );

            $stripe_connect_account = $stripe_connect_account->id;
            $this->User_model->update($user_id, ['stripe_connect_account' => $stripe_connect_account]);
        }

        $result = $stripe->accountLinks->create(
            [
                'account' => $stripe_connect_account,
                'refresh_url' => 'https://rentworthy.us/account',
                'return_url' => base_url() . '/account/verify/account/' . $stripe_connect_account,
                'type' => 'account_update',
                'collect' => 'currently_due'
            ]
        );

        return $this->respond($result, 200);
    }

 
    public function cancel_order_owner() {

        /**
         * Cancels the money hold (hold) in stripe when the owner rejects (Deny) the request. *
         * 
         */

        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $alquiler_id = $this->request->getJSON()->alquiler_id;
        $user_id = $this->request->getJSON()->user_id;
        if (!$alquiler_id) {
            return $this->respond(401);
        }

        $query = $this->Alquiler_model->find($alquiler_id);
        if (!$query) {
            return $this->respond(401);
        }

        $checkPayment = $this->getPaymentIntentsStatus($query->stripePayID);
        switch ($checkPayment->status) {

            case 'requires_capture':
                $result = $stripe->paymentIntents->cancel($query->stripePayID, []);
                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $result->canceled_at), 'stripeRefund_user_add' => $user_id]);
                return $this->respond('Canceled', 200);
                break;
            case 'succeeded':
                break;
            case 'processing':
                return $this->respond(['message' => 'Payment cancellation is not possible, because the payment is still being processed, please try again later.'], 400);
                break;
            case 'canceled':
                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $checkPayment->canceled_at)]);
                return $this->respond(['message' => 'The payment is cancelled.', 'status' => 'canceled'], 400);
                break;
        }
    }

    public function cancel_order_customer() {

        /**
         * Cancels the money hold (hold) in stripe when the owner rejects (Deny) the request. *
         * 
         */

        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $alquiler_id = $this->request->getJSON()->alquiler_id;
        $user_id = $this->request->getJSON()->user_id;
        $fee_pay = $this->request->getJSON()->fee_pay;
        if (!$alquiler_id) {
            return $this->respond(401);
        }

        $query = $this->Alquiler_model->find($alquiler_id);
        if (!$query) {
            return $this->respond(401);
        }
        $fecha_inicio = Time::parse($query->fecha_inicio);
        $diff = $fecha_inicio->difference(Time::now());
        $fee_pay = $diff->getHours() > -48 ? true : false;

        $checkPayment = $this->getPaymentIntentsStatus($query->stripePayID);
        switch ($checkPayment->status) {

            case 'requires_payment_method':
            case 'requires_confirmation':
            case 'requires_capture':
            case 'requires_action':
            case 'processing':

                $result = $stripe->paymentIntents->cancel($query->stripePayID, ['cancellation_reason' => 'requested_by_customer']);
                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $result->canceled_at), 'stripeRefund_user_add' => $user_id]);
                return $this->respond('Canceled', 200);

                break;
            case 'succeeded':
                if ($fee_pay) {    
                    $devolucion = number_format(($query->importe / 2), 2, '', '');
                    $result = $stripe->refunds->create([
                        'amount' => $devolucion,
                        'payment_intent' => $query->stripePayID,
                        'refund_application_fee' => true,
                        'reverse_transfer' => true,
                    ]);
                } else {
                    $result = $stripe->refunds->create([
                        'payment_intent' => $query->stripePayID,
                        'refund_application_fee' => true,
                        'reverse_transfer' => true,
                    ]);
                }

                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $result->created)]);
                return $this->respond(['message' => 'The payment is cancelled.', 'status' => 'canceled'], 200);
                break;

            case 'canceled':
                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $checkPayment->canceled_at)]);
                return $this->respond(['message' => 'The payment is cancelled.', 'status' => 'canceled'], 400);
                break;
        }
    }

    function getPaymentIntentsStatus($stripePayID) {
        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $result = $stripe->paymentIntents->retrieve($stripePayID, []);

        return $result;
    }

    public function approved_order() {

        /**
         *Check the status of the payment withholding, if it is still valid, change the status of the rental to Approved, otherwise cancel it.
         * 
         */

        $stripe = new \Stripe\StripeClient(STRIPE_SECRET);
        $alquiler_id = $this->request->getJSON()->alquiler_id;
        if (!$alquiler_id) {
            return $this->respond(401);
        }

        $query = $this->Alquiler_model->find($alquiler_id);
        if (!$query) {
            return $this->respond(401);
        }

        $checkPayment = $this->getPaymentIntentsStatus($query->stripePayID);

        switch ($checkPayment->status) {

            case 'requires_capture':

                $cargo_servicio = str_replace('.', '', $query->cargo_servicio);
                $stripe->paymentIntents->capture(
                    $query->stripePayID,
                    [
                        'application_fee_amount' => $cargo_servicio,

                    ]
                );
                if ($stripe) {
                    $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Approved']);
                }
                return $this->respond('Approved', 200);
                break;
            case 'succeeded':
                break;
            case 'processing':
                return $this->respond(['message' => 'Approval is not possible, because the payment is still being processed, please try again later.'], 400);
                break;
            case 'canceled':
                $query = $this->Alquiler_model->update($alquiler_id, ['estado' => 'Canceled', 'stripeRefund_at' => date('Y-m-d H:i:s', $checkPayment->canceled_at)]);
                return $this->respond(['message' => 'Approval is not possible because the payment was cancelled.', 'status' => 'canceled'], 400);
                break;
        }
    }
}