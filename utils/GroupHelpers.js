export const initValuesGroup = (group, setValue) => {
    setValue("id", group.id);
    setValue("name", group.name);
    setValue("informations", group.informations);
};

export const resetValues = (setValue, setSelected, setMembers) => {
    setValue("id", undefined);
    setValue("name", undefined);
    setValue("informations", undefined);
    setSelected([]);
    setMembers([""]);
};
