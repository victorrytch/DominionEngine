class RequiredFieldValidator {
    requiredFields: string[];

    constructor(requiredFields: string[]) {
        this.requiredFields = requiredFields;
    }

    check(request: any): boolean {
        var result = true;
        this.requiredFields.forEach((eachField) => {

            if (request.body[eachField] == null || request.body[eachField] == undefined) {
                result = false;
            }

        });

        return result;
    }

}