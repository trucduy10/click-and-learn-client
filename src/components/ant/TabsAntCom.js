import { Tabs } from "antd";
import { useEffect, useState } from "react";

// const items = [
//   {
//     key: "1",
//     label: `Tab 1`,
//     children: `Content of Tab Pane 1`,
//   },
//   {
//     key: "2",
//     label: `Tab 2`,
//     children: `Content of Tab Pane 2`,
//   },
//   {
//     key: "3",
//     label: `Tab 3`,
//     children: `Content of Tab Pane 3`,
//   },
// ];
const TabsAntCom = ({ items = [] }) => {
  const [key, setKey] = useState(1);
  const [newItems, setNewItems] = useState([]);
  const onChange = (key) => {
    setKey(key);
  };

  useEffect(() => {
    if (key !== "4") {
      const newItems = items.map((item) => {
        if (item.key === "4") {
          return {
            ...item,
            children: null,
          };
        }
        return item;
      });

      setNewItems(newItems);
    } else {
      setNewItems(items);
    }
  }, [key, items]);

  return (
    <Tabs
      size="large"
      defaultActiveKey="1"
      items={newItems}
      onChange={onChange}
    />
  );
};
export default TabsAntCom;
