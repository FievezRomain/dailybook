import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome6, FontAwesome, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import CompletionBar from './CompletionBar';
import ModalSubMenuObjectifActions from './Modals/ModalSubMenuObjectifActions';
import ModalObjectif from './Modals/ModalObjectif';
import ModalObjectifSubTasks from './Modals/ModalObjectifSubTasks';
import ObjectifCard from './cards/ObjectifCard';
import ModalDefaultNoValue from './Modals/ModalDefaultNoValue';
import { useTheme } from 'react-native-paper';
import { useObjectifs } from '../providers/ObjectifsProvider'; 
import StatePicker from './StatePicker';

const ObjectifsBloc = ({ animaux, selectedAnimal, navigation }) =>{
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const { objectifs, setObjectifs } = useObjectifs();
    const [objectifsDisplay, setObjectifsDisplay] = useState([]);
    const [currentObjectif, setCurrentObjectif] = useState({});
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
    const arrayState = [
        {value: 'En cours', label: 'En cours', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
        {value: 'Terminé', label: 'Terminé', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
    ];
    const [temporality, setTemporality] = useState('En cours');

/*     useEffect(() => {
        if(animaux.length !== 0){
            getObjectifs();
        }
    }, [animaux, navigation]); */

    useEffect(() => {
        if(selectedAnimal.length !== 0){
            changeObjectifsDisplay();
        }
    }, [objectifs, temporality, selectedAnimal]);

/*     const getObjectifs = async () => {
        var result = await objectifService.getObjectifs(currentUser.email);

        if(result.length != 0){
            setObjectifs(result);
        }
    } */

    const changeObjectifsDisplay = () => {
        var filteredObjectifs = []
        if(temporality === "En cours"){
            filteredObjectifs = objectifs.filter((item) =>  item.sousEtapes.some(etape => etape.state === false) 
                                    && selectedAnimal.some(animal => item.animaux.includes(animal.id))
                                    && new Date(item.datefin) >= new Date() );
        } else{
            filteredObjectifs = objectifs.filter((item) => (item.sousEtapes.every(etape => etape.state === true) 
                                    || new Date(item.datefin) < new Date() )
                                    && selectedAnimal.some(animal => item.animaux.includes(animal.id)) );
        }
        

        setObjectifsDisplay(filteredObjectifs);
    }

    const handleModify = () => {
        setModalObjectifVisible(true);
    }

    const onModify = (objectif) => {
        var tempArray = objectifs;

        var index = tempArray.findIndex(objet => objet.id === objectif.id);

        if(index !== -1){
            tempArray[index] = objectif;
        }

        setObjectifs(tempArray);
        changeObjectifsDisplay();
    }
    const handleDelete = (objectif) => {
        let updatedObjectifs = [];
        updatedObjectifs = [... objectifs];

        var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
        updatedObjectifs.splice(index, 1);

        setObjectifs(updatedObjectifs);
        changeObjectifsDisplay();
    }

    const handleManageTasks = () => {
        setModalManageTasksVisible(true);
    }

    function hexToRgba(hex, opacity) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
    }

    const onTemporalityChange = (value) => {
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
            height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.text,
        },
        composantContainer:{
            marginTop: 10,
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
            paddingLeft: 20,
            paddingRight: 20,
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
        }
    });

    return (
        <>
            <ModalSubMenuObjectifActions
                modalVisible={modalSubMenuObjectifVisible}
                setModalVisible={setModalSubMenuObjectifVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
                handleManageTasks={handleManageTasks}
            />
            <ModalObjectif
                actionType={"modify"}
                isVisible={modalObjectifVisible}
                setVisible={setModalObjectifVisible}
                objectif={currentObjectif}
                onModify={onModify}
            />
            <ModalObjectifSubTasks
                isVisible={modalManageTasksVisible}
                setVisible={setModalManageTasksVisible}
                objectif={currentObjectif}
                handleTasksStateChange={onModify}
            />
            <View style={styles.temporalityIndicator}>
                <StatePicker
                arrayState={arrayState}
                handleChange={onTemporalityChange}
                defaultState={temporality}
                color={hexToRgba(colors.quaternary, 1)}
                />
            </View>
            <ScrollView contentContainerStyle={{paddingBottom: 30, width: "100%"}}>
                <View style={styles.composantContainer}>
                
                    {/* <Text style={[{textAlign: "center", color: colors.default_dark, fontSize: 16, paddingVertical: 15}, styles.textFontBold]}>Objectifs</Text> */}
                    
                    {objectifsDisplay.length !== 0 ?
                        objectifsDisplay.map((objectif, index) => {
                            return(
                                <View style={styles.objectifContainer} key={objectif.id}>
                                    <ObjectifCard
                                            objectif={objectif}
                                            animaux={animaux}
                                            handleObjectifChange={onModify}
                                            handleObjectifDelete={handleDelete}
                                    />
                                </View>
                            );
                        })
                    :
                        <ModalDefaultNoValue
                            text={"Vous n'avez aucun objectif"}
                        />
                    }
                    
                </View>
            </ScrollView>
        </>
    );
}

export default ObjectifsBloc;
