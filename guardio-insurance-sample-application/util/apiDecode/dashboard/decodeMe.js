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

import callMe from "../../apiCall/dashboard/callMe";
import { commonDecode } from "../../util/apiUtil/commonDecode";
import { decodeUser } from "../../util/apiUtil/decodeUser";

/**
 * 
 * @param session 

 * @returns logged in users object. If failed `null`
 */
export default async function decodeMe(session) {
    try {
        var meData;

        if (!session.user || session.user.id === undefined || session.user.userName === undefined
            || session.user.name === undefined || session.user.emails === undefined) {
            meData = await commonDecode(() => callMe(session), null);
        } else {
            meData = session.user;
        }

        const meReturn = decodeUser(meData);

        return meReturn;
    } catch (err) {

        return null
    }
}
