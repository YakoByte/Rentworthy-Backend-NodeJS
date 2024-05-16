import { roleModel, historyModel } from "../models";
import { roleRequest } from "../../interface/role";

class RoleRepository {
  async CreateRole(roleInputs: roleRequest) {
    try {
      const findRole = await roleModel.findOne({ name: roleInputs.name });
      console.log("findRole", findRole);
      if (findRole) {
        const data = {
          id: findRole._id,
          name: findRole.name,
        };

        return data;
      }

      const role = new roleModel(roleInputs);
      const roleResult = await role.save();

      const history = new historyModel({
        roleId: roleResult._id,
        log: [
          {
            objectId: roleResult._id,
            action: `roleName = ${roleInputs.name} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return roleResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Role");
    }
  }

  async getRoleById(roleInputs: roleRequest) {
    try {
      const findRole = await roleModel.findOne({ _id: roleInputs._id });
      console.log("findRole", findRole);
      if (findRole) {
        const data = {
          id: findRole._id,
          name: findRole.name,
        };

        return data;
      }
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get role by Id User");
    }
  }
}

export default RoleRepository;
