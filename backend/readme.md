server setup.
user auth API = login/signup, logout,me making routes first userAuth
for storing req.body, first validate data using npm i validator
It has inbuilt functions to check like isEmail = to check correct format, isStrongPassword

There is need to check again the email of the user before register, alone unique: true is not suficient as unique do not support custom msg unlike required,minlength etc. so mongodb can give error w/o any msg, so manually resolve this.

201 : if new resource created
401 : unauthorised access

make a special route for admin, as anyone can fill his role as admin and gain special access to our system.