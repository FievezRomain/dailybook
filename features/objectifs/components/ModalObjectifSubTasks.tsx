import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import CheckboxInput from '../../../shared/components/inputs/CheckboxInput';
import CompletionBar from '../../../shared/components/common/CompletionBar';
import { updateObjectif } from '../../../services/api/ObjectifService';
import LoggerService from '../../../services/logs/LoggerService';
import cloneDeep from 'lodash/cloneDeep';

interface ModalObjectifSubTasksProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  handleTasksStateChange?: (objectif: any) => void;
  objectif?: any;
}

const ModalObjectifSubTasks = ({ isVisible, setVisible, handleTasksStateChange, objectif = {} }: ModalObjectifSubTasksProps) => {
  const { colors, fonts } = useAppTheme();
  const [tasks, setTasks] = useState<any[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (isVisible && objectif?.sousEtapes) {
      const cloned = cloneDeep(objectif.sousEtapes);
      setTasks(cloned);
      calculateCompletion(cloned);
    }
  }, [isVisible, objectif]);

  const calculateCompletion = (taskList: any[]) => {
    if (!taskList?.length) { setCompletionPercentage(0); return; }
    const done = taskList.filter(t => t.etat === true).length;
    setCompletionPercentage(Math.round((done / taskList.length) * 100));
  };

  const toggleTask = (index: number) => {
    const updated = cloneDeep(tasks);
    updated[index].etat = !updated[index].etat;
    setTasks(updated);
    calculateCompletion(updated);
  };

  const closeModal = () => setVisible(false);

  const updateTasks = async () => {
    try {
      const updatedObjectif = cloneDeep(objectif);
      updatedObjectif.sousEtapes = tasks;
      const result = await updateObjectif(String(objectif.id), { ...objectif, sousEtapes: tasks });
      handleTasksStateChange?.(result);
      closeModal();
    } catch (err: any) {
      LoggerService.log('Erreur lors de la mise à jour des sous-étapes: ' + err.message);
    }
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    container: { backgroundColor: colors.background, borderTopLeftRadius: 12, borderTopRightRadius: 12, minHeight: '50%', maxHeight: '85%', paddingBottom: 30 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    title: { fontFamily: fonts.bodyLarge.fontFamily, fontSize: 16, color: colors.default_dark },
    actionText: { fontFamily: fonts.default.fontFamily, color: colors.default_dark },
    cancelText: { fontFamily: fonts.default.fontFamily, color: colors.tertiary },
    progressContainer: { paddingHorizontal: 20, marginBottom: 10 },
    scrollContent: { paddingHorizontal: 20 },
    taskRow: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.quaternary },
  });

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Sous-étapes</Text>
            <TouchableOpacity onPress={updateTasks}>
              <Text style={styles.actionText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressContainer}>
            <CompletionBar percentage={completionPercentage} />
            <Text style={[styles.actionText, { textAlign: 'center', marginTop: 4 }]}>{completionPercentage}% complété</Text>
          </View>
          <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {tasks.map((task, index) => (
              <View key={index} style={[styles.taskRow, { flexDirection: 'row', alignItems: 'center' }]}>
                <CheckboxInput isChecked={task.etat} onChange={() => toggleTask(index)} />
                <Text style={styles.actionText}>{task.titre}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalObjectifSubTasks;
