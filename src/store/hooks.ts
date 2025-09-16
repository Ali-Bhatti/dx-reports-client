import { useStoreContext, type AppDispatch, type RootState } from './index';

export const useAppDispatch = (): AppDispatch => {
  const { dispatch } = useStoreContext();
  return dispatch;
};

export const useAppSelector = <TSelected,>(selector: (state: RootState) => TSelected): TSelected => {
  const { state } = useStoreContext();
  return selector(state);
};
