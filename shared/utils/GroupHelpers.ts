interface Group {
  id?: string;
  name?: string;
  informations?: string;
}

type SetValue = (name: string, value: unknown) => void;
type SetState<T> = (value: T) => void;

export const initValuesGroup = (group: Group, setValue: SetValue): void => {
  setValue("id", group.id);
  setValue("name", group.name);
  setValue("informations", group.informations);
};

export const resetValues = (
  setValue: SetValue,
  setSelected: SetState<unknown[]>,
  setMembers: SetState<string[]>,
): void => {
  setValue("id", undefined);
  setValue("name", undefined);
  setValue("informations", undefined);
  setSelected([]);
  setMembers([""]);
};
