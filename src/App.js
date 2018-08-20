import React, {Component} from "react";
import header from "./food-overhead.jpg";
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
      ingredients: "",
      showRecipe: false
    };
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
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

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value) {
    this.setState({[key]: value});
  }

  addItem() {
    // create a new item with unique id
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice(),
      ingredients: this.state.ingredients.slice()
    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    list.push(newItem);

    // update state with new list, reset the new item input
    this.setState({
      list,
      newItem: "",
      ingredients: ""
    });
  }

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({list: updatedList});
  }

  showItem() {
    this.setState({showRecipe: true});
  }


  render() {

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
                    <button
                      onClick={() => this.showItem(item.id)}
                    >
                      Show
                    </button>
                    <button onClick={() => this.deleteItem(item.id)}>
                      Delete
                    </button>
                    {this.state.showRecipe ? console.log("weszło") : null }

                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {/*<Modal show={this.state.isModalOpen} onClose={this.toggleModal}/>*/}
      </div>
    );
  }
}

export default App;
