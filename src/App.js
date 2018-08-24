import React, {Component} from "react";
import header from "./food-overhead.jpg";
import "./App.css";
import Details from "./Details"


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
      ingredients: "",
      showRecipe: false,
      itemToShow: [{
        value: "",
        ingredients: ""
      }],
      editedValue: "",
      editedIngredients: "",
      inputDisabled: true
    };
  }

  componentDidMount() {
    this.compareData();
    window.addEventListener(
      "beforeunload",
      this.saveToStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveToStorage.bind(this)
    );
    this.saveToStorage();
  }

  compareData() {
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({[key]: value});
        } catch (e) {
          // handle empty string
          this.setState({[key]: value});
        }
      }
    }
  }

  saveToStorage() {
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value) {
      this.setState({
        [key]: value
      });
  }

  editInput(key, value) {
    if (this.state.editedValue === "") {
      this.setState({
        editedValue: this.state.itemToShow[0].value
      })
    } else {
        this.setState({
          [key]: value
        });
      }

    if (this.state.editedIngredients === "") {
      this.setState({
        editedIngredients: this.state.itemToShow[0].ingredients
      })
    } else {
      this.setState({
        [key]: value
      });
    }
  }

  addItem() {
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice(),
      ingredients: this.state.ingredients.slice()
    };
    const list = [...this.state.list];

    list.push(newItem);

    this.setState({
      list,
      newItem: "",
      ingredients: ""
    });
  }

  saveChangedItem(id) {
    const list = [...this.state.list];
    const toEdit = list.filter(item => item.id === id);

    console.log(toEdit[0]);
    // console.log(list.indexOf(idToEdit));

    let index = list.indexOf(toEdit[0]);
    if (index > -1) {
      list.splice(index, 1);
    }

    const editedItem = {
      id: toEdit[0].id,
      value: this.state.editedValue.slice(),
      ingredients: this.state.editedIngredients.slice()
    };

    list.push(editedItem);

    this.setState({
      list,
      showRecipe: false,
      editedValue: "",
      editedIngredients: "",
      inputDisabled: true
    })
  }

  closeItem() {
    this.setState({
      showRecipe: !this.state.showRecipe,
      itemToShow: "",
      inputDisabled: true
    });
  }

  deleteItem(id) {
    console.log(id);
    const list = [...this.state.list];
    const updatedList = list.filter(item => item.id !== id);

    this.setState({
      list: updatedList,
      showRecipe: false
    });
  }

  showItem(id) {
    const list = [...this.state.list];
    const toShow = list.filter(item => item.id === id);

    this.setState({
      showRecipe: !this.state.showRecipe,
      itemToShow: toShow,
    });
  }


  render() {
    console.log(this.state.itemToShow);
    console.log(this.state);

    return (
      <div className="App">
        <header>
          <img src={header} className="header-background" alt="header-background"/>
          <h1 className="title">My personal cookbook</h1>
        </header>
        <div className="recipes">
          <form>

            <input className="new-recipe"
                   type="text"
                   placeholder="Add new recipe"
                   value={this.state.newItem}
                   onChange={e => this.updateInput("newItem", e.target.value)}
            />

            <textarea className="new-ingredients"
                      placeholder="Add ingredients"
                      value={this.state.ingredients}
                      onChange={e => this.updateInput("ingredients", e.target.value)}>

            </textarea>
            <button className="new-recipe-button"
                    onClick={() => this.addItem()}
                    disabled={!this.state.newItem.length}
            >
              Add
            </button>
          </form>
          <div className="list-container">
            <ul>
              {this.state.list.map(item => {
                return (
                  <li className="list-item" key={item.id}>
                    {item.value}
                    {this.state.showRecipe &&
                    <Details>
                      <div className="modal ingredients-list">
                        Name:
                        <input disabled={this.state.inputDisabled}
                               defaultValue={this.state.itemToShow[0].value}
                               type="text"
                               onChange={e => this.updateInput("editedValue", e.target.value)}
                          // value={this.state.editedName}
                        />
                        Ingredients:
                        <textarea disabled={this.state.inputDisabled}
                                  defaultValue={this.state.itemToShow[0].ingredients}
                                  onChange={e => this.updateInput("editedIngredients", e.target.value)}
                          // value={this.state.editedIngredients}
                        />
                        <button onClick={() => this.setState({
                          inputDisabled: false,
                          editedValue: this.state.itemToShow[0].value,
                          editedIngredients: this.state.itemToShow[0].ingredients})}>
                          Edit
                        </button>
                        {this.state.inputDisabled === false &&
                        <button onClick={() => this.saveChangedItem(this.state.itemToShow[0].id)}>
                          Save
                        </button>
                        }
                        <button onClick={() => this.deleteItem(this.state.itemToShow[0].id)}>
                          Delete
                        </button>
                        <button onClick={() => this.closeItem()}>
                          Close
                        </button>
                      </div>
                    </Details >
                    }

                    <button onClick={() => this.showItem(item.id)}>
                      Show
                    </button>

                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
