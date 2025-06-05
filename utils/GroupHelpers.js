export const initValuesGroup = (group, setValue) => {
    setValue("id", group.id);
    setValue("name", group.name);
};

export const resetValues = (setValue, setSelected, setMembers) => {
    setValue("id", undefined);
    setValue("name", undefined);
    setSelected([]);
    setMembers([""]);
};
