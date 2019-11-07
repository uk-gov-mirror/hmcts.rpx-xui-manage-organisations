import { UserModel} from '../../models/user.model';
import { AuthActionTypes, UserProfileActions } from '../actions/user-profile.actions';
import {createFeatureSelector} from '@ngrx/store';
import * as fromAcceptTCActions from '../../../accept-tc/store/actions';

export interface AuthState {
  isAuthenticated: boolean;
  hasUserAcceptedTC: boolean
  user: UserModel | null;
  loaded: boolean;
  loading: boolean;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  hasUserAcceptedTC: true,
  user: null,
  loaded: false,
  loading: false,

};

export function reducer(
  state = initialState,
  action: UserProfileActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.GET_USER_DETAILS_SUCCESS: {
      const user = new UserModel(action.payload);
      return {
        ...state,
        user,
        isAuthenticated: true,
        loaded: true,
        loading: false,
      };
    }
    case AuthActionTypes.LOAD_HAS_ACCEPTED_TC_SUCCESS: {
      return {
        ...state,
        hasUserAcceptedTC: action.payload
      };
    }
  }
  return state;
}
export const getAuthState = createFeatureSelector<AuthState>('userProfile');

export const isAuthenticated = (state: AuthState) =>  state.isAuthenticated;
export const getUser = (state: AuthState) => state.user;
export const isUserLoaded = (state: AuthState) => state.loaded;
export const isUserLoading = (state: AuthState) => state.loading;
export const gethasUserAcceptedTC = (state: AuthState) => state.hasUserAcceptedTC;
