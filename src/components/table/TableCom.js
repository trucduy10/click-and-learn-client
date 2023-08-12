import PropTypes from "prop-types";
import React from "react";
import Table from "react-data-table-component";
import { withErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import { DropdownAntCom } from "../ant";
import { ButtonCom } from "../button";
import ErrorCom from "../common/ErrorCom";

const TableCom = ({
  title = "",
  columns,
  items = [],
  urlCreate = null,
  dropdownItems = [],
  tableKey = 0,
  onSelectedRowsChange = () => {},
  classNameBtnCreate = "",
  selectableRows = true,
  ...rest
}) => {
  const { search, setSearch } = rest;
  return (
    <Table
      key={tableKey}
      title={title}
      columns={columns}
      data={items}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="500px"
      selectableRows={selectableRows}
      selectableRowsHighlight
      onSelectedRowsChange={onSelectedRowsChange}
      highlightOnHover
      actions={
        <div key="table-actions" className="flex items-center gap-x-2 z-10">
          <DropdownAntCom items={dropdownItems}></DropdownAntCom>
          {urlCreate && (
            <Link to={urlCreate} key={urlCreate} className={classNameBtnCreate}>
              <ButtonCom
                className="text-white text-center px-3 text-sm"
                backgroundColor="info"
              >
                Create New
              </ButtonCom>
            </Link>
          )}
        </div>
      }
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control md:w-72"
        />
      }
    ></Table>
  );
};

TableCom.propTypes = {
  title: PropTypes.string,
  urlCreate: PropTypes.any,
  tableKey: PropTypes.number,
  columns: PropTypes.array,
  dropdownItems: PropTypes.array,
  items: PropTypes.array.isRequired,
  classNameBtnCreate: PropTypes.string,
};
export default withErrorBoundary(TableCom, {
  FallbackComponent: ErrorCom,
});
