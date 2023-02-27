import { FunctionComponent, ButtonHTMLAttributes } from "react";

type SharedProps = ButtonHTMLAttributes<HTMLButtonElement>;

type RegisterButton = {
  color: "#e4d740" | "#6140e4";
};

type LoginButton = {
  color: "#40e495" | "#e44040";
};

type Props<Variant> = Variant extends RegisterButton
  ? RegisterButton
  : LoginButton;

interface FormButtonComponent<Variant>
  extends FunctionComponent<Props<Variant> & SharedProps> {
  RegisterButton: FormButtonComponent<RegisterButton>;
  LoginButton: FormButtonComponent<LoginButton>;
}

export const FormButton: FormButtonComponent<any> = (props) => {
  return (
    <button
      className="w-full p-2"
      style={{ backgroundColor: props.color }}
      {...props}
    >
      {props.children}
    </button>
  );
};

FormButton.RegisterButton = FormButton;
FormButton.LoginButton = FormButton;
