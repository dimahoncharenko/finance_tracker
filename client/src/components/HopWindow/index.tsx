// Imports main functionality
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isTurnedOn: boolean;
  embeddedStyles?: string;
};

export const HopWindow = ({ children, isTurnedOn, embeddedStyles }: Props) => {
  return (
    <div className={`${isTurnedOn ? "block" : "hidden"} ${embeddedStyles}`}>
      <div>{children}</div>
    </div>
  );
};
