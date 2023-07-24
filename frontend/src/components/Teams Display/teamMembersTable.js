import TeamMembersTableRow from "./teamMembersTableRow";

const TeamMembersTable = (props) => {
    return (
        <div className="membersTableWrapper">
            <table className="membersTable">
                <thead className="membersTableHeader">
                    <tr className="tableHeader">
                        <th className="tableHeaderCell">
                            <p className="tableHeaderCellText">Summoner</p>
                        </th>
                        <th className="tableHeaderCell">
                            <p className="tableHeaderCellText">Role</p>
                        </th>
                        <th className="tableHeaderCell">
                            <p className="tableHeaderCellText">Rank</p>
                        </th>
                        <th className="tableHeaderCell">
                            <p className="tableHeaderCellText">Winrate</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.members.map((member, i) => {
                        return (
                            <TeamMembersTableRow
                                key={i}
                                member={member}
                                rolesFilled={props.rolesFilled}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TeamMembersTable;
