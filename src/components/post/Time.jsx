import { View, Text, StyleSheet } from "react-native";

export default function Time({ timeFeched }) {

    function getTime() {
        var firestoreTimestamp = timeFeched;
        var data = firestoreTimestamp.toDate();
        var time = {
            DMA: `${data.getDate() < 10 ? "0" + data.getDate() : data.getDate()}/${data.getMonth() + 1 < 10 ? `${data.getMonth()}` + 1 : data.getMonth() + 1}/${data.getFullYear() - 2000}`,
            HM: `${data.getHours() < 10 ? "0" + data.getHours() : data.getHours()}:${data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes()}`
        }

        return time;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.time}>
                {getTime().DMA}
            </Text>
            <Text style={styles.time}>
                {getTime().HM}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    time: {
        marginHorizontal: 4,
        fontFamily: 'KantumruyProLight',
        color: '#8B8B8B',
        fontSize: 10,
    },
});
