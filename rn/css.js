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
    //box1-1
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
        borderBottomWidth: 1,
    },
    //box2-row1
    row: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        borderStyle: 'solid',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        borderBottomLeftRadius: 20,
    },
    //box2-env
    env: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    //box2-R1-C1
    box2R1C1: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    //box2-R1-C2
    box2R1C2: {
        flex: 9,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    //box2-R1-C3
    box2R1C3: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    //box2-R1-C1-A
    box2R1C1A: {
        flex: 1,
    },
    //box2-R1-C2-A
    box2R1C2A: {
        flex: 1,
        paddingBottom: 10,
    },
    //box2-R1-C2-B
    box2R1C2B: {
        flex: 1,
    },
    //box2-R1-C3-A
    box2R1C3A: {
        flex: 1,
        paddingBottom: 10,
    },
    //box2-R1-C3-B
    box2R1C3B: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

})
