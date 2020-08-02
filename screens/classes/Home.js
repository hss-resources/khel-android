import React from "react";
import { StyleSheet, View, FlatList, ScrollView, Text, AsyncStorage } from "react-native";
import { Button, Card, ToggleButton, Switch, TextInput, Dialog, Portal, Checkbox, ActivityIndicator, Colors } from "react-native-paper";
import styles from "../../assets/styles/styles";

import khel from "../../assets/khel.json";

export default class Home extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      pursuit: false,
      team: false,
      individual: false,
      mandal: false,
      sit: false,
      ekhel: false,
      dand: false,
      search: "",
      searchData: khel,
      data: [],
      list: [],
      editedList: [],
      item: null,
      checkboxes: [],
      visible: false,
      isLoading: true
    }
  }

  async componentDidMount() {
    var maps = JSON.parse(await AsyncStorage.getItem("store"));
    var array = [];
    maps.forEach(item => array.push(false));
    this.setState({
      isLoading: false,
      checkboxes: array,
      list: maps,
      editedList: maps,
      data: khel
    });
  }

  async componentWillUnmount() {
    await AsyncStorage.setItem("store", JSON.stringify(this.state.editedList));
  }

  evaluateCriteria() {
    const categories = ["Pursuit", "Individual", "Mandal", "Team", "Sitting down", "Dand", "E-Khel"];
    const temp = [];
    if (this.state.pursuit) {
      temp.push("Pursuit");
    }
    if (this.state.individual) {
      temp.push("Individual")
    }
    if (this.state.mandal) {
      temp.push("Mandal")
    }
    if (this.state.team) {
      temp.push("Team");
    }
    if (this.state.sit) {
      temp.push("Sitting down");
    }
    if (this.state.dand) {
      temp.push("Dand")
    }
    if (this.state.ekhel) {
      temp.push("E-Khel")
    }
    if (temp.length == 0) {
      return categories;
    }
    return temp;
  }

  sortByProps(props) {
    const list = this.state.data.sort(
      function (a, b) {
        if (a[props] < b[props]) {
          return -1;
        } else if (a[props] > b[props]) {
          return 1;
        } else {
          return 0;
        }
      }
    );
    this.setState({data: list});
  }

  updateSearch() {
    const criteria = this.evaluateCriteria();
    const list = this.state.data.filter(
      item => criteria.includes(item.category));
      this.setState({
        searchData: list
      });
    }

  openDialog(item) {
      this.setState({
        item: item,
        visible: true,
      });
    }

  hideDialog() {
      let array = new Array(this.state.checkboxes.length).fill(false);
      this.setState({
        checkboxes: array,
        visible: false
      });
    }

  searchStr() {
      if (this.state.search == "") {
        updateSearch();
      } else {
        updateSearch();
        const array = this.state.searchData.filter(
          item => item.name == this.state.search
        );

        this.setState({
          searchData: array
        });
      }
    }

  async addToList() {

      var indexes = this.state.checkboxes.map(
        item => {
          if (item == true) {
            return this.state.checkboxes.indexOf(item);
          }
        }
      );

      var map = this.state.list.filter(
        (item) => indexes.includes(this.state.list.indexOf(item))
      );

      map.forEach(
        item => item.khel.push(this.state.item)
      );

      this.setState({editedList: map, visible: false}, () => {
        alert("Added!");
      });
      await AsyncStorage.setItem("store", this.state.editedList);
      return;
  }

  toggleView() {
      return (
        <View style={styles.container}>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>Pursuit</Text>
            <Switch
              value={this.state.pursuit}
              onValueChange={(isChecked) =>
                this.setState({pursuit: isChecked}, () => this.updateSearch())
            }/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>Individual</Text>
            <Switch
              value={this.state.individual}
              onValueChange={(isChecked) =>
                this.setState({individual: isChecked}, () => this.updateSearch())
            }/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>Mandal</Text>
            <Switch
              value={this.state.mandal}
              onValueChange={(isChecked) =>
                this.setState({mandal: isChecked}, () => this.updateSearch())
            }/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>Team</Text>
            <Switch
              value={this.state.team}
              onValueChange={(isChecked) =>
                this.setState({team: isChecked}, () => this.updateSearch())
            }/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>Sitting down</Text>
            <Switch
              value={this.state.sit}
              onValueChange={(isChecked) =>
                this.setState({sit: isChecked}, () => this.updateSearch())
            }/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>Dandh</Text>
            <Switch
              value={this.state.dand}
              onValueChange={(isChecked) =>
                this.setState({dand: isChecked}, () => this.updateSearch())
            }/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.switchText}>E-Khel</Text>
            <Switch
              value={this.state.ekhel}
              onValueChange={(isChecked) =>
                this.setState({ekhel: isChecked}, () => this.updateSearch())
            }/>
          </View>
        </View>
      );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating={true} color={Colors.red800}/>
          <Text>Please wait while your selection loads</Text>
        </View>
      );
    } else {
      return (
        <View>
          <FlatList
            data={this.state.searchData}
            ListHeaderComponent={this.toggleView()}
            renderItem = {({item, index}) => (
            <View key={item.name}>
              <Card>
                <Card.Title title={item.name} />
                <Card.Content>
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" icon="plus" onPress={() => this.openDialog(item)}>
                    Add to List
                  </Button>
                  <Button icon="information-outline" onPress={() => this.props.navigation.navigate("KhelInfo",
                    {
                      item: item
                    }
                  )}>
                    More Info
                  </Button>
                  </Card.Actions>
                </Card>
              <Portal>
                <Dialog visible={this.state.visible} onDismiss={() => this.hideDialog()}>
                <Dialog.Title>Please choose the list:</Dialog.Title>
                <Dialog.Content>
                  {this.state.checkboxes.map((item, index) => (
                    <View>
                      <Text>{this.state.list[index].name}</Text>
                      <Checkbox.Android
                        status={this.state.checkboxes[index] ? "checked": "unchecked"}
                        onPress={() => {
                          let array = this.state.checkboxes;
                          array[index] = !item;
                          this.setState({checkboxes: array}, () => console.log("update", this.state.checkboxes));
                        }
                      }/>
                    </View>
                  ))}
                </Dialog.Content>
                <Dialog.Actions>
                  <Button mode="contained" icon="plus" onPress={() => this.addToList()}>
                    Add to List
                  </Button>
                  <Button icon="information-outline" onPress={() => this.hideDialog()}>
                    Close
                  </Button>
                </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
            )}
            keyExtractor={(item, index) => item.name}
          />
        </View>
      );
    }
  }

}
