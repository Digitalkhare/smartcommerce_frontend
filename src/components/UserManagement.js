import React from "react";
import { Table, Button } from "react-bootstrap";
import { InvisibleLastRow } from "../util/InvisibleLastRow";

function UserManagement({ users }) {
  const tableContainerStyle = {
    overflowX: "auto",
    overflowY: "visible",
    maxHeight: "none",
  };

  return (
    <div className="p-4">
      <h3>All Users</h3>
      <div style={tableContainerStyle}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="text-nowrap">
                  {user.firstName} {user.lastName}
                </td>
                <td className="text-nowrap">{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td className="text-nowrap text-center">
                  {" "}
                  {/* ✅ center content */}
                  <div className="d-flex justify-content-center gap-2">
                    {" "}
                    {/* ✅ Bootstrap flex utility */}
                    <Button variant="info" size="sm">
                      Show
                    </Button>
                    <Button variant="primary" size="sm">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                    <Button variant="warning" size="sm">
                      Deactivate
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            <InvisibleLastRow colSpan={5} />
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default UserManagement;
