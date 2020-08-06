import React from "react";
import { Card, Button, Surface, Text, Divider, Title, Subheader, Paragraph, Caption } from "react-native-paper";
import { View,  AsyncStorage, FlatList } from "react-native";

import styles from "../../assets/styles/styles";

export default class ListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  async componentDidMount() {
    const { object } = this.props.route.params;
    this.setState({data: object});
  }

  async componentWillUnmount() {
    await AsyncStorage.setItem("store", this.state.data);
  }

  async remove(item) {
    const list = this.state.data.filter(x => x.name !== item.name);
    console.log(list);
    await AsyncStorage.setItem("store", JSON.stringify(list));
    this.setState({data: list});
  }

  headerComponent = () => (
    <View>
      <Text style={styles.title}>{this.state.data.name}</Text>
    </View>
  )

  render() {
    return (
      <View>
        <FlatList
          data={this.state.data.khel}
          renderItem={({item, index}) =>
          <View key={index} style={styles.cardContainer}>
            <Card>
              <Card.Title title={item.name} />
              <Card.Content>
                <View style={{flexDirection: "row", flex: 1}}>
                  <Surface style={this.adjustStyles(item.category)} key={index}><Text style={this.adjustText(item.category)}>{item.category}</Text></Surface>
                </View>
                <View style={styles.rowContainer}>
                  <Text>Aim: {item.aim}</Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <View>
                  <Button onPress={() => this.remove(item)}>Remove Item</Button>
                  <Button onPress={() => this.props.navigation.navigate("Menu", {
                      item: item
                    })}>
                  More info
                  </Button>
                </View>
              </Card.Actions>
            </Card>
          </View>
          }
          keyExtractor={(item, index) => item.name}
        />
      </View>
    );
  }
}
