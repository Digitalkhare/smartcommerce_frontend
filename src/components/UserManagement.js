import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { InvisibleLastRow } from "../util/InvisibleLastRow";

function UserManagement({ users, onShow, onEdit, onDelete, onToggleStatus }) {
  const tableContainerStyle = {
    overflowX: "auto",
    overflowY: "visible",
    maxHeight: "none",
  };

  // Helper to render a status badge
  const renderStatusBadge = (status) => {
    let variant;
    let style = {};
    switch (status.toLowerCase()) {
      case "active":
        variant = "success";
        break;
      case "inactive":
        variant = "warning";
        style = { color: "black" };
        // variant = "secondary";
        break;
      case "pending":
        variant = "warning";
        break;
      case "banned":
        variant = "danger";
        break;
      default:
        variant = "dark";
    }
    return (
      <Badge bg={variant} style={style}>
        {status}
      </Badge>
    );
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
            {users.map((user) => {
              const isAdmin = user.role.toLowerCase() === "admin";

              return (
                <tr key={user.id}>
                  <td className="text-nowrap">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="text-nowrap">{user.email}</td>
                  <td>{user.role}</td>
                  <td>{renderStatusBadge(user.status)}</td>
                  <td className="text-nowrap text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => onShow(user)}
                      >
                        Show
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isAdmin}
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isAdmin}
                        onClick={() => onDelete(user.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant={
                          user.status.toLowerCase() === "active"
                            ? "warning"
                            : "success"
                        }
                        size="sm"
                        disabled={isAdmin}
                        onClick={() => onToggleStatus(user)}
                      >
                        {user.status.toLowerCase() === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <InvisibleLastRow colSpan={5} />
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default UserManagement;
