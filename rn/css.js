import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    isLoading: {
        flex: 1,
        padding: 20,
    },
    //box0
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    //box1
    msg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    error: {
        flex: 1,
        color: 'red',
    },
    //box1
    subtitle: {
        color: 'green',
    },
    //box2
    content: {
        flex: 9,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'gray',
        borderTopWidth: 1,
    },
    flatListRow: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        borderStyle: 'solid',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        borderBottomLeftRadius: 15,
    },
    flatListRowC1: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListRowC2: {
        flex: 9,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    flatListRowC3: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListRowC1A: {
        flex: 1,
        paddingBottom: 3,
    },
    flatListRowC1B: {
        flex: 1,
    },
    //setting screen
    settingFormRow: {
        flexDirection: 'row',
        padding: 10,
        borderStyle: 'solid',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        borderBottomLeftRadius: 15,
    },
    settingFormColA: {
        flex: 4,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    settingFormColB: {
        flex: 8,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    settingFormRowTextInput: {
        color: 'gray',
    },
    settingFormBtnRow: {
        flexDirection: 'row',
        padding: 50,
    },
    settingFormBtn: {
        flex: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingFormRowTitle: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
