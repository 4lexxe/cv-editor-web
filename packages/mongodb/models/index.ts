import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./User";
import { Resume } from "./Resume";
import { SharedResumeModel } from "./SharedResume";

export const UserModel = getModelForClass(User, {
  options: { customName: "users" },
});

export const ResumeModel = getModelForClass(Resume, {
  options: { customName: "resumes" },
});

export { SharedResumeModel };
