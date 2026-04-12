import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { FontAwesome6, FontAwesome, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useObjectifsQuery, OBJECTIFS_KEY } from '../../../hooks/queries/useObjectifsQuery';
import ModalSubMenuObjectifActions from './ModalSubMenuObjectifActions';
import ModalObjectif from './ModalObjectif';
import ModalObjectifSubTasks from './ModalObjectifSubTasks';
import ObjectifCard from './ObjectifCard';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import { useAppTheme } from '../../../theme/useAppTheme';
import StatePicker from '../../../shared/components/inputs/StatePicker';
import { isAfter, isBefore, isEqual, startOfDay } from 'date-fns';

const ObjectifsBloc = ({ animaux, selectedAnimal, navigation }: any) =>{
    const { colors, fonts } = useAppTheme();
    const { data: objectifs = [] } = useObjectifsQuery();
    const queryClient = useQueryClient();
    const [objectifsDisplay, setObjectifsDisplay] = useState<any[]>([]);
    const [currentObjectif, setCurrentObjectif] = useState({});
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
    const arrayState = [
        {value: 'En cours', label: 'En cours', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
        {value: 'Terminé', label: 'Terminé', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
    ];
    const [temporality, setTemporality] = useState('En cours');

    useEffect(() => {
        if(selectedAnimal.length !== 0){
            changeObjectifsDisplay();
        }
    }, [objectifs, temporality, selectedAnimal]);

    const changeObjectifsDisplay = () => {
        var filteredObjectifs: any[] = []
        if(temporality === "En cours"){
            filteredObjectifs = objectifs.filter((item: any) =>  item.sousEtapes.some((etape: any) => etape.state === false) 
                                    && selectedAnimal.some((animal: any) => item.animaux.includes(animal.id))
                                    && (isAfter(startOfDay(new Date(item.datefin)), startOfDay(new Date())) ||
                                    isEqual(startOfDay(new Date(item.datefin)), startOfDay(new Date()))) );
        } else{
            filteredObjectifs = objectifs.filter((item: any) => (
                                        item.sousEtapes.every((etape: any) => etape.state === true) 
                                        || isBefore(startOfDay(new Date(item.datefin)), startOfDay(new Date()))
                                    )
                                    && selectedAnimal.some((animal: any) => item.animaux.includes(animal.id)) );
        }

        setObjectifsDisplay(filteredObjectifs);
    }

    const handleModify = () => {
        setModalObjectifVisible(true);
    }

    const onModify = (objectif: any) => {
        queryClient.invalidateQueries({ queryKey: OBJECTIFS_KEY });
    }
    const handleDelete = (objectif: any) => {
        queryClient.invalidateQueries({ queryKey: OBJECTIFS_KEY });
    }

    const handleManageTasks = () => {
        setModalManageTasksVisible(true);
    }

    function hexToRgba(hex: any, opacity: any) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m: any, r: any, g: any, b: any) => r + r + g + g + b + b);
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
    }

    const onTemporalityChange = (value: any) => {
        setTemporality(value);
    };

    const styles = StyleSheet.create({
        headerObjectif:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        completionBarContainer:{
            marginTop: 10,
            marginBottom: 10
        },
        statistiquesContainer:{
            justifyContent: "center",
        },
        bottomBar: {
            width: '100%',
            height: 0.3,
            backgroundColor: colors.text,
        },
        composantContainer:{
            paddingLeft: 20,
            paddingRight: 20,
            height: "100%",
        },
        headerContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
            marginBottom: 10,
        },
        title:{
            color: colors.quaternary,
            marginLeft: 10,
        },
        statistiqueIndicatorContainer:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
        },
        itemIndicatorStatistique:{
            padding: 5,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            paddingHorizontal: 10,
        },
        temporalityIndicator:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            alignSelf: "center",
            paddingBottom: 15,
            top: 5,
            zIndex: 1,
        },
        itemIconDefault:{
            color: colors.quaternary,
        },
        itemIconSelected:{
            color: colors.default_dark,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        objectifContainer:{
            display: "flex",
            flexDirection: "row",
            width: "100%"
        },
    });

    return (
        <>
            <ModalSubMenuObjectifActions
                modalVisible={modalSubMenuObjectifVisible}
                setModalVisible={setModalSubMenuObjectifVisible}
                handleModify={handleModify}
                handleDelete={() => handleDelete(currentObjectif)}
                handleManageTasks={handleManageTasks}
            />
            <ModalObjectif
                actionType={"modify"}
                isVisible={modalObjectifVisible}
                setVisible={setModalObjectifVisible}
                objectif={currentObjectif as any}
                onModify={onModify}
            />
            <ModalObjectifSubTasks
                isVisible={modalManageTasksVisible}
                setVisible={setModalManageTasksVisible}
                objectif={currentObjectif as any}
                handleTasksStateChange={onModify}
            />
                
            <FlatList
                data={objectifsDisplay}
                scrollEnabled={false}
                ListHeaderComponentStyle={styles.temporalityIndicator}
                contentContainerStyle={styles.composantContainer}
                style={{paddingLeft: 20, paddingRight: 20}}
                ListHeaderComponent={
                    <StatePicker
                        arrayState={arrayState}
                        handleChange={onTemporalityChange}
                        defaultState={temporality}
                        color={hexToRgba(colors.quaternary, 1) ?? undefined}
                    />
                }
                ListEmptyComponent={
                    <ModalDefaultNoValue
                        text={"Vous n'avez aucun objectif"}
                    />
                }
                renderItem={({ item }) => (
                    <View style={styles.objectifContainer} key={item.id}>
                        <ObjectifCard
                            objectif={item}
                            animaux={animaux}
                            handleObjectifChange={onModify}
                            handleObjectifDelete={handleDelete}
                        />
                    </View>
                )}
            />
        </>
    );
}

export default ObjectifsBloc;
