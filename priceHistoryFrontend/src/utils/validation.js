
export const validateName = (name) => {
    if(name.length <3)return false;
     const nameRegex = /^[A-Za-z]+([ -]?[A-Za-z]+)*$/;
     if(!nameRegex.test(name)) return false;
     return true;
}

export const validateEmail = (email) => {
     const emailRegex = /\S+@\S+\.\S+/;
     return emailRegex.test(email);
}

export const validatePassword = (password) => {
    if(password.length < 6) return false;

      const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if(!uppercaseRegex.test(password)) return false;
  if(!numberRegex.test(password)) return false;
  if(!specialCharRegex.test(password)) return false;

  return true;

}