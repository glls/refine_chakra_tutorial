import React from "react";
import { useTable, ColumnDef, flexRender } from "@pankod/refine-react-table";
import {
  List,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  DateField,
  Select,
  EditButton,
  HStack,
  ShowButton,
  DeleteButton,
} from "@pankod/refine-chakra-ui";
import { GetManyResponse, useMany } from "@pankod/refine-core";

import { IPost, ICategory, FilterElementProps } from "../../interfaces";
import { ColumnFilter, ColumnSorter } from "../../components/table";
import { Pagination } from "../../components/pagination";


export const PostList: React.FC = () => {
  const columns = React.useMemo<ColumnDef<IPost>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
      },
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        meta: {
          filterOperator: "contains",
        },
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        meta: {
          filterElement: function render(props: FilterElementProps) {
            return (
              <Select defaultValue="published" {...props}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="rejected">Rejected</option>
              </Select>
            );
          },
          filterOperator: "eq",
        },
      },
      {
        id: "category.id",
        header: "Category",
        enableColumnFilter: false,
        accessorKey: "category.id",
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            categoriesData: GetManyResponse<ICategory>;
          };
          const category = meta.categoriesData?.data.find(
            (item) => item.id === getValue()
          );
          return category?.title ?? "Loading...";
        },
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        enableColumnFilter: false,

        cell: function render({ getValue }) {
          return <DateField value={getValue() as string} format="LLL" />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton
                hideText
                size="sm"
                recordItemId={getValue() as number}
              />
              <EditButton
                hideText
                size="sm"
                recordItemId={getValue() as number}
              />
              <DeleteButton
                hideText
                size="sm"
                recordItemId={getValue() as number}
              />
            </HStack>
          );
        },
      },
    ],
    []
  );
  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      tableQueryResult: { data: tableData },
      setCurrent,
      pageCount,
      current,
    },
  } = useTable({
    columns,
  });

  const categoryIds = tableData?.data?.map((item) => item.category.id) ?? [];
  const { data: categoriesData } = useMany<ICategory>({
    resource: "categories",
    ids: categoryIds,
    queryOptions: {
      enabled: categoryIds.length > 0,
    },
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      categoriesData,
    },
  }));

  return (
    <List>
      <TableContainer whiteSpace="pre-line">
        <Table variant="simple">
          <Thead>
            {getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {!header.isPlaceholder && (
                      <HStack spacing="2">
                        <Text>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Text>
                        <HStack spacing="2">
                          <ColumnSorter column={header.column} />
                          <ColumnFilter column={header.column} />
                        </HStack>
                      </HStack>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        current={current}
        pageCount={pageCount}
        setCurrent={setCurrent}
      />
    </List>
  );
};
