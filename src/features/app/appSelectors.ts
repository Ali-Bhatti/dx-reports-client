import type { RootState } from '../../app/store';

export const selectCurrentEnvironment = (state: RootState) => state.app.currentEnvironment;
export const selectCopyModalEnvironment = (state: RootState) => state.app.copyModalEnvironment;
