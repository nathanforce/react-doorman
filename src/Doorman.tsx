import React from "react";
import { pascalCase } from "change-case";

export type User = {};

export interface DoormanProps {
  initialUser?: User;
  roles: {}; // TODO: How to type this as a key/value map of { role: checker }
  onLogin: (user: User, state?: DoormanState) => void;
  onLogout: (prevUser: User, state?: DoormanState) => void;
  children: React.ReactNode | ((doorman: DoormanContext) => React.ReactNode);
}

export interface DoormanState {
  user?: User;
  login: (user: User) => void;
  logout: () => void;
  isRole: (role: string) => boolean;
  // TODO: How to add types for dynamic components
  // TODO: How to add types for dynamic isFn's
}

export interface DynamicRoleComponentProps {
  children: React.ReactNode | ((isRole: boolean) => React.ReactNode);
}

export type DoormanContext = DoormanState;

export const DoormanContext = React.createContext<DoormanContext>({} as any);

export default class Doorman extends React.Component<
  DoormanProps,
  DoormanState
> {
  constructor(props: DoormanProps) {
    super(props);
    const isFns =
      this.props.roles &&
      Object.keys(this.props.roles).reduce(
        (acc, role) => ({
          ...acc,
          [`is${pascalCase(role)}`]: () => this.isRole(role)
        }),
        {}
      );

    const components =
      this.props.roles &&
      Object.keys(this.props.roles).reduce(
        (acc, role) => ({
          ...acc,
          [pascalCase(role)]: (props: DynamicRoleComponentProps) => {
            const match = this.isRole(role);
            if (typeof props.children === "function") {
              return props.children(match);
            }
            return match && props.children;
          }
        }),
        {}
      );

    this.state = {
      user: this.props.initialUser,
      login: this.login,
      logout: this.logout,
      isRole: this.isRole,
      ...isFns,
      ...components
    };
  }

  login = (user: User) => {
    this.setState({ user }, () => {
      if (this.props.onLogin) {
        this.props.onLogin(user, this.state);
      }
    });
  };

  logout = () => {
    this.setState(({ user: prevUser }) => {
      if (this.props.onLogout && prevUser) {
        this.props.onLogout(prevUser, this.state);
      }
      return { user: undefined };
    });
  };

  isRole = (role: string) => {
    if (!this.state.user) {
      return false;
    }

    const { roles } = this.props;

    return roles[role](this.state.user);
  };

  render() {
    return (
      <DoormanContext.Provider value={this.state}>
        <DoormanContext.Consumer>
          {doorman => {
            if (typeof this.props.children === "function") {
              return this.props.children(doorman);
            }
            return this.props.children;
          }}
        </DoormanContext.Consumer>
      </DoormanContext.Provider>
    );
  }
}
