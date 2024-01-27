import ComplainRepository from "../database/repository/complain";
import { FormateData, FormateError } from "../utils";

import {
  ComplainRequest,
  ComplainUpdateRequest,
  ComplainDeleteRequest,
  ComplainGetRequest,
} from "../interface/complain";

// All Business logic will be here
class ComplainService {
  private repository: ComplainRepository;

  constructor() {
    this.repository = new ComplainRepository();
  }
  // create Complain
  async CreateComplain(ComplainInputs: ComplainRequest) {
    try {
      const existingComplain: any = await this.repository.CreateComplain(
        ComplainInputs
      );

      return FormateData(existingComplain);
    } catch (err: any) {
      return FormateError({ error: "Data not Created" });
    }
  }

  // get Complain by id , search or all Complain
  async getComplain(ComplainInputs: ComplainGetRequest) {
    try {
      let existingComplain: any;
      if (ComplainInputs._id) {
        existingComplain = await this.repository.getComplainById({
          _id: ComplainInputs._id,
        });
      } else if (ComplainInputs.name) {
        existingComplain = await this.repository.getComplainByName({
          name: ComplainInputs.name,
        });
      } else if (ComplainInputs.userId) {
        existingComplain = await this.repository.getComplainByUserId({
          userId: ComplainInputs.userId,
        });
      } else if (ComplainInputs.productId) {
        existingComplain = await this.repository.getComplainByProductId({
          productId: ComplainInputs.productId,
        });
      } else if (ComplainInputs.lat && ComplainInputs.long) {
        existingComplain = await this.repository.getComplainByLocation({
          lat: Number(ComplainInputs.lat),
          long: Number(ComplainInputs.long),
        });
      } else {
        existingComplain = await this.repository.getAllComplain({
          skip:
            Number(ComplainInputs.page) * Number(ComplainInputs.limit) -
              Number(ComplainInputs.limit) || 0,
          limit: Number(ComplainInputs.limit) || 10,
        });
      }
      return FormateData(existingComplain);
    } catch (err: any) {
      return FormateError({ error: "Data not Found" });
    }
  }

  // update Complain
  async updateComplain(ComplainInputs: ComplainUpdateRequest) {
    try {
      const existingComplain: any = await this.repository.updateComplain(
        ComplainInputs
      );

      return FormateData(existingComplain);
    } catch (err: any) {
      return FormateError({ error: "Data not Updated" });
    }
  }

  // delete Complain
  async deleteComplain(ComplainInputs: ComplainDeleteRequest) {
    try {
      const existingComplain: any = await this.repository.deleteComplain(
        ComplainInputs
      );

      return FormateData(existingComplain);
    } catch (err: any) {
      return FormateError({ error: "Data not Deleted" });
    }
  }
}

export = ComplainService;
