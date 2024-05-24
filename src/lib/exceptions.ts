enum ExceptionTypes {
  account_in_use = "account_in_use",
  repo_doesnt_exist = "repo_doesnt_exists",
  no_commits = "no_commits",
}

export interface Exception {
  code: number;
  msg: string;
  payload?: any;
}

export const Exceptions: Record<ExceptionTypes, Exception> = {
  [ExceptionTypes.account_in_use]: {
    msg: "This GitHub account is linked to a different wallet",
    code: 1,
  },
  [ExceptionTypes.repo_doesnt_exist]: {
    msg: "This repository does not exist",
    code: 2,
  },
  [ExceptionTypes.no_commits]: {
    msg: "You don't have any commit",
    code: 3,
  },
};

export const isValidException = (object: any): object is Exception => {
  return object && object.code && object.msg;
};
