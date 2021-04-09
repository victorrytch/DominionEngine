class Util {

    static contains(a: any[], obj: any): boolean {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    static shuffle(array: any[]): any[] {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }

    static randomInRange(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static isArray(obj) {
        return !!obj && obj.constructor === Array;
    }

    static convertToArray(value) {
        if (!Util.isArray(value)) {
            var newArray = [];
            newArray.push(value);
            return newArray;
        }
        return value;
    }

    static isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

}