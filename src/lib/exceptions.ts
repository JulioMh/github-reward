enum ExceptionTypes {
  account_in_use = "account_in_use",
}

export interface Exception {
  code: number;
  msg: string;
  payload?: any;
}

export const Exceptions: Record<ExceptionTypes, Exception> = {
  [ExceptionTypes.account_in_use]: {
    msg: "This GitHub account is linked to a different wallet",
    code: 12,
  },
};

export const isValidException = (object: any): object is Exception => {
  return object && object.code && object.msg;
};
