import { useSnackbar, VariantType } from 'notistack';
const { enqueueSnackbar } = useSnackbar();

export function enqueueMessage(message: string, variant?: VariantType): void {
    enqueueSnackbar(message, { variant });
}