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

import React, { useCallback, useEffect, useState } from "react";
import { Table } from "rsuite";
import AddUserButton from "./otherComponents/addUserButton";
import AddUserComponent from "./otherComponents/addUserComponent";
import EditUserComponent from "./otherComponents/editUserComponent";
import styles from "../../../../../styles/Settings.module.css";
import decodeViewUsers from "../../../../../util/apiDecode/settings/decodeViewUsers";
import SettingsTitle from "../../../../common/settingsTitle";

/**
 * 
 * @param prop - orgName, orgId, session
 * 
 * @returns A component that will show the users in a table view
 */
export default function ManageUserSectionComponent(prop) {

    const { orgName, orgId, session } = prop;

    const [ users, setUsers ] = useState([]);
    const [ editUserOpen, setEditUserOpen ] = useState(false);
    const [ addUserOpen, setAddUserOpen ] = useState(false);

    const [ openUser, setOpenUser ] = useState({});

    const fetchData = useCallback(async () => {
        const res = await decodeViewUsers(session);

        await setUsers(res);
    }, [ session ]);

    useEffect(() => {
        if (!editUserOpen || !addUserOpen) {
            fetchData();
        }
    }, [ editUserOpen, addUserOpen, fetchData ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    const { Column, HeaderCell, Cell } = Table;

    const closeEditDialog = () => {
        setOpenUser({});
        setEditUserOpen(false);
    };

    const onEditClick = (user) => {
        setOpenUser(user);
        setEditUserOpen(true);
    };

    const closeAddUserDialog = () => {
        setAddUserOpen(false);
    };

    const onAddUserClick = () => {
        setAddUserOpen(true);
    };

    return (
        <div
            className={ styles.tableMainPanelDiv }
        >
            <EditUserComponent
                session={ session }
                open={ editUserOpen }
                onClose={ closeEditDialog }
                user={ openUser } />

            <AddUserComponent
                orgName={ orgName }
                orgId={ orgId }
                session={ session }
                open={ addUserOpen }
                onClose={ closeAddUserDialog } />

            <SettingsTitle
                title="Manage Users"
                subtitle="Manage users in the organisation">
                <AddUserButton
                    session={ session }
                    onClick={ onAddUserClick } />
            </SettingsTitle>

            {
                users ?
                    (<Table
                        height={ 900 }
                        data={ users }
                    >
                        <Column width={ 200 } align="center">
                            <HeaderCell><h6>First Name</h6></HeaderCell>
                            <Cell dataKey="firstName" />
                        </Column>

                        <Column width={ 200 } align="center">
                            <HeaderCell><h6>Last Name</h6></HeaderCell>
                            <Cell dataKey="familyName" />
                        </Column>

                        <Column flexGrow={ 2 } align="center">
                            <HeaderCell><h6>User Name</h6></HeaderCell>
                            <Cell dataKey="username" />
                        </Column>

                        <Column flexGrow={ 2 } align="center">
                            <HeaderCell><h6>Email</h6></HeaderCell>
                            <Cell dataKey="email" />
                        </Column>

                        <Column flexGrow={ 1 } align="center" fixed="right">
                            <HeaderCell><h6>Edit User</h6></HeaderCell>

                            <Cell>
                                { rowData => (
                                    <span>
                                        <a onClick={ () => onEditClick(rowData) } style={ { cursor: "pointer" } }>
                                            Edit
                                        </a>
                                    </span>
                                ) }
                            </Cell>
                        </Column>

                    </Table>)
                    : null
            }
        </div>
    );
}
