/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import callPatchApplicationAuthSteps from "../../../apiCall/settings/application/callPatchApplicationAuthSteps";
import { commonDecode } from "../../../util/apiUtil/commonDecode";
import {
    ENTERPRISE_AUTHENTICATOR_ID, ENTERPRISE_ID, GOOGLE_AUTHENTICATOR_ID, GOOGLE_ID, BASIC_ID, BASIC_AUTHENTICATOR_ID
} from "../../../util/common/common";

/**
 * 
 * @param template
 * 
 * @returns get authentication sequence
 */
function getAuthenticationSequenceModel(template) {
    let authenticationSequenceModel = template.authenticationSequence;
    delete authenticationSequenceModel.requestPathAuthenticators;
    authenticationSequenceModel.type = "USER_DEFINED";

    return authenticationSequenceModel;
}
/**
 * 
 * @param templateId
 * 
 * @returns get authenticator id for the given template id
 */
function getAuthenticatorId(templateId) {
    switch (templateId) {
        case GOOGLE_ID:

            return GOOGLE_AUTHENTICATOR_ID;
        case ENTERPRISE_ID:

            return ENTERPRISE_AUTHENTICATOR_ID;
        case BASIC_ID:

            return BASIC_AUTHENTICATOR_ID;
        default:

            return null;
    }
}

/**
 * 
 * @param idpTempleteId 
 * @param idpName
 * 
 * @returns get authenticator body
 */
function getAuthenticatorBody(idpTempleteId, idpName) {

    return {
        "idp": idpName,
        "authenticator": getAuthenticatorId(idpTempleteId)
    }
}

/**
 * 
 * @param template 
 * @param idpTempleteId 
 * @param idpName 
 * @param method
 * 
 * @returns add or remove idp from the login sequence
 */
function addRemoveAuthSequence(template, idpTempleteId, idpName, method) {

    let authenticationSequenceModel = getAuthenticationSequenceModel(template);

    if (method) {
        authenticationSequenceModel.steps[0].options = [(getAuthenticatorBody(idpTempleteId, idpName))];

        return authenticationSequenceModel;
    } else {

        let basicCheck = false;

        for (let j = authenticationSequenceModel.steps.length - 1; j >= 0; j--) {
            let step = authenticationSequenceModel.steps[j];
            for (let i = 0; i < step.options.length; i++) {
                if (step.options[i].idp === idpName) {
                    step.options.splice(i, 1);
                    if (step.options.length === 0) {
                        authenticationSequenceModel.steps.splice(j, 1);
                    }
                    break;
                } else if (step.options[i].authenticator === "BasicAuthenticator") {
                    basicCheck = true;
                }
            }
        }

        if (!basicCheck) {
            try {
                authenticationSequenceModel.steps[0].options.push(getAuthenticatorBody(BASIC_ID, "LOCAL"));
            } catch (e) {
                authenticationSequenceModel.steps.push({
                    "id": 1,
                    "options": [(getAuthenticatorBody(BASIC_ID, "LOCAL"))]
                });
            }
        }

        return authenticationSequenceModel;
    }
}

/**
 * 
 * @param session 
 * @param template 
 * @param idpDetails 
 * @param method
 * 
 * @returns decode patch applicaiton authentication steps API calls.
 */
export default async function decodePatchApplicationAuthSteps(session, template, idpDetails, method) {

    let applicationId = template.id;
    let idpName = idpDetails.name;
    let idpTempleteId = idpDetails.templateId;

    let authenticationSequenceModel = {
        "authenticationSequence": addRemoveAuthSequence(template, idpTempleteId, idpName, method)
    }

    try {
        const res = await commonDecode(
            () => callPatchApplicationAuthSteps(session, applicationId, authenticationSequenceModel), null);

        return res;
    } catch (err) {

        return null;
    }
}
