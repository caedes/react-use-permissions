import { render, screen } from "@testing-library/react";
import React from "react";

import { PermissionsProvider, usePermissions } from "./";

const TestedComponent = ({ roles = [] }) => {
  const { can } = usePermissions(roles);
  const canReadText = can("read", "text");
  const canEditText = can("edit", "text");
  const canDeleteText = can("delete", "text");

  return (
    <>
      {canReadText && <h2>OK</h2>}
      {canEditText && <input type="text" name="text" aria-label="textInput" />}
      {canDeleteText && <button>Delete</button>}
    </>
  );
};

const okTitle = () => screen.queryByRole("heading", { level: 2, name: "OK" });
const input = () => screen.queryByRole("textbox", { name: "textInput" });
const button = () => screen.queryByRole("button", { name: "Delete" });

const permissions = {
  developper: [{ action: "read", resource: "text" }],
  techLead: [{ action: ["read", "edit"], resource: "text" }],
  admin: [{ action: "*", resource: "text" }],
};

describe("react-use-permissions", () => {
  describe("while not setting any permission", () => {
    beforeEach(() => {
      render(
        <PermissionsProvider>
          <TestedComponent roles={["admin"]} />
        </PermissionsProvider>
      );
    });

    it("does not display OK title", () => {
      expect(okTitle()).not.toBeInTheDocument();
    });

    it("does not display the input", () => {
      expect(input()).not.toBeInTheDocument();
    });

    it("does not display the delete button", () => {
      expect(button()).not.toBeInTheDocument();
    });
  });

  describe("while setting permissions", () => {
    describe("with no role", () => {
      beforeEach(() => {
        render(
          <PermissionsProvider permissions={permissions}>
            <TestedComponent roles={[]} />
          </PermissionsProvider>
        );
      });

      it("does not display OK title", () => {
        expect(okTitle()).not.toBeInTheDocument();
      });

      it("does not display the input", () => {
        expect(input()).not.toBeInTheDocument();
      });

      it("does not display the delete button", () => {
        expect(button()).not.toBeInTheDocument();
      });
    });

    describe("with anonymous role", () => {
      beforeEach(() => {
        render(
          <PermissionsProvider permissions={permissions}>
            <TestedComponent roles={["anonymous"]} />
          </PermissionsProvider>
        );
      });

      it("does not display OK title", () => {
        expect(okTitle()).not.toBeInTheDocument();
      });

      it("does not display the input", () => {
        expect(input()).not.toBeInTheDocument();
      });

      it("does not display the delete button", () => {
        expect(button()).not.toBeInTheDocument();
      });
    });

    describe("with developper role", () => {
      beforeEach(() => {
        render(
          <PermissionsProvider permissions={permissions}>
            <TestedComponent roles={["developper"]} />
          </PermissionsProvider>
        );
      });

      it("displays OK title", () => {
        expect(okTitle()).toBeInTheDocument();
      });

      it("does not display the input", () => {
        expect(input()).not.toBeInTheDocument();
      });

      it("does not display the delete button", () => {
        expect(button()).not.toBeInTheDocument();
      });
    });

    describe("with techLead role", () => {
      beforeEach(() => {
        render(
          <PermissionsProvider permissions={permissions}>
            <TestedComponent roles={["techLead"]} />
          </PermissionsProvider>
        );
      });

      it("displays OK title", () => {
        expect(okTitle()).toBeInTheDocument();
      });

      it("displays the input", () => {
        expect(input()).toBeInTheDocument();
      });

      it("does not display the delete button", () => {
        expect(button()).not.toBeInTheDocument();
      });
    });

    describe("with admin role", () => {
      beforeEach(() => {
        render(
          <PermissionsProvider permissions={permissions}>
            <TestedComponent roles={["admin"]} />
          </PermissionsProvider>
        );
      });

      it("displays OK title", () => {
        expect(okTitle()).toBeInTheDocument();
      });

      it("displays the input", () => {
        expect(input()).toBeInTheDocument();
      });

      it("displays the delete button", () => {
        expect(button()).toBeInTheDocument();
      });
    });
  });
});
