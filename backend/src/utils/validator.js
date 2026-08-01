import validator from "validator";

const validate = (data)=>{
const mandatoryFields = ['firstName','emailId','password'];

const isAllowed = mandatoryFields.every((k)=>Object.keys(data).includes(k));

  if(!isAllowed) throw new Error("field missing");

  if(!validator.isEmail(data.emailId)) throw new Error("Invalid email");
  if(!validator.isStrongPassword(data.password)) throw new Error("Enter a strong password");

}
export default validate;
