/// <reference path="../../../../headers/common.d.ts" />
declare var _default: {
    alertQueryDef: any;
    getStateDisplayModel: (state: any) => {
        text: string;
        iconClass: string;
        stateClass: string;
    };
    conditionTypes: {
        text: string;
        value: string;
    }[];
    evalFunctions: {
        text: string;
        value: string;
    }[];
    severityLevels: {
        'critical': {
            text: string;
            iconClass: string;
            stateClass: string;
        };
        'warning': {
            text: string;
            iconClass: string;
            stateClass: string;
        };
    };
    noDataModes: {
        text: string;
        value: string;
    }[];
    reducerTypes: {
        text: string;
        value: string;
    }[];
    createReducerPart: (model: any) => any;
};
export default _default;
