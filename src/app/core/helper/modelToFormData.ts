export class ModelToFormData {
    public static build(data: any, formData?: FormData, parentKey?: string): FormData {
        if (formData == null) {
            formData = new FormData();
        }

        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
                this.build(data[key], formData, parentKey ? `${parentKey}[${key}]` : key);
            });
            if (data.length === 0) {
                formData.append(parentKey, `[]`);
            }
        } else {
            const value = data == null ? '' : data;

            formData.append(parentKey, value);
        }

        return formData;
    }
}