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

import { getHostedUrl } from "../../../util/apiUtil/getUrls";
import { getInternalApiRequestOptions } from "../../../util/apiUtil/getInteralApiRequestOptions";

/**
 * call GET `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/applications` to all the applicaions
 * 
 * @param session
 * 
 * @returns all applicaitons, if the call failed `null`
 */
export default async function callListAllApplications(session) {

    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/application/listAllApplications`,
            getInternalApiRequestOptions(session)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
