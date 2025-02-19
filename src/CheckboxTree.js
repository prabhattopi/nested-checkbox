import React, { useState } from "react";

const nestedCheckboxData = [
  {
    label: "Parent 1",
    children: [
      {
        label: "Parent 2",
        children: [
          { label: "Child 1" },
          { label: "Child 2" },
          { label: "Child 3" },
          {
            label: "Child 4",
            children: [{ label: "Child 5" }, { label: "Child 6" }],
          },
        ],
      },
      { label: "Parent 3" },
      { label: "Parent 4" },
      { label: "Parent 5" },
    ],
  },
];

const NestedCheckbox = ({ data, checkedItems, setCheckedItems, path = "" }) => {
  const handleChange = (fullPath) => {
    const newCheckedItems = { ...checkedItems };
    const isChecked = !checkedItems[fullPath];

    newCheckedItems[fullPath] = isChecked;

    // ✅ Update all children recursively
    const updateChildren = (node, parentPath) => {
      if (node.children) {
        node.children.forEach((child, index) => {
          const childPath = `${parentPath}.${index}`;
          newCheckedItems[childPath] = isChecked;
          updateChildren(child, childPath);
        });
      }
    };

    updateChildren(data, fullPath);

    // ✅ Update parents recursively
    const updateParents = (currentPath) => {
      if (!currentPath) return;
      const parentSegments = currentPath.split(".");
      parentSegments.pop();
      const parentPath = parentSegments.join(".");

      if (!parentPath) return;

      // Get parent node dynamically
      const getParentNode = (node, segments) => {
        if (segments.length === 0) return node;
        const index = parseInt(segments[0], 10);
        if (!node.children || !node.children[index]) return null;
        return getParentNode(node.children[index], segments.slice(1));
      };

      const parentNode = getParentNode(
        { children: nestedCheckboxData },
        parentSegments
      );

      if (parentNode) {
        // Check if all children are selected
        const allChildrenChecked = parentNode.children.every(
          (child, idx) => newCheckedItems[`${parentPath}.${idx}`]
        );

        newCheckedItems[parentPath] = allChildrenChecked;
        updateParents(parentPath);
      }
    };

    updateParents(fullPath);

    setCheckedItems(newCheckedItems);
  };

  const isChecked = checkedItems[path] || false;

  return (
    <div style={{ marginLeft: "20px" }}>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => handleChange(path)}
        />
        {data.label}
      </label>
      {data.children &&
        data.children.map((child, index) => (
          <NestedCheckbox
            key={index}
            data={child}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            path={`${path}.${index}`}
          />
        ))}
    </div>
  );
};

const CheckboxTree = () => {
  const [checkedItems, setCheckedItems] = useState({});

  return (
    <div>
      {nestedCheckboxData.map((item, index) => (
        <NestedCheckbox
          key={index}
          data={item}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          path={`${index}`}
        />
      ))}
    </div>
  );
};

export default CheckboxTree;
