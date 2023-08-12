import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, permission, theme) {
  return {
    fontWeight: theme.typography.fontWeightRegular,
    // permission.indexOf(name.permission) === -1
    //   ? theme.typography.fontWeightRegular
    //   : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectMuiCom({
  onChange = () => [],
  selectedValue,
  permissions = [],
}) {
  const theme = useTheme();

  return (
    <div>
      <FormControl sx={{ mt: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Permission</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedValue}
          onChange={onChange}
          input={<OutlinedInput id="select-multiple-chip" label="Permission" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value.id} label={value.permission} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {permissions.map((p) => (
            <MenuItem
              key={p.id}
              value={p}
              style={getStyles(p.permission, selectedValue, theme)}
            >
              {p.permission}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultipleSelectMuiCom;
