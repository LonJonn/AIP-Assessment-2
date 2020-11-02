import { Favour } from "models";
import User, { UserSchema } from "models/User";

/**
 * recStack stands for ‘recursion stack’,
 * and it’s what’s keeping track of the back edges,
 * the vertices we visited to get us to our current vertex
 */

// Referenced: https://hackernoon.com/the-javascript-developers-guide-to-graphs-and-detecting-cycles-in-them-96f4f619d563

export default class PartyDetector {
  private allUsers: UserSchema[];
  private adjList: Record<string, string[]>;
  private debtor: UserSchema;
  private recipient: UserSchema;
  private visited: Record<string, boolean>;
  private recStack: Record<string, boolean>;

  constructor(debtor: UserSchema, recipient: UserSchema) {
    this.adjList = {};
    this.debtor = debtor;
    this.recipient = recipient;
    this.visited = {};
    this.recStack = {};
  }

  public async init() {
    await this.initAdjList();
    return this;
  }

  public findParty() {
    const debotrChildren = this.adjList[this.debtor._id];

    let biggestParty = [];

    for (let i = 0; i < debotrChildren.length; i++) {
      const res = this.detectCycle(i);

      if (res.includes(this.recipient._id) && res.length > 2 && res.length > biggestParty.length) {
        biggestParty = res;
      }
    }

    return biggestParty.map((id) => this.allUsers.filter((u) => u._id === id)[0]);
  }

  private detectCycle(offSet: number = 0) {
    this.visited = {};
    this.recStack = {};

    const hasCycle = this.detectCycleUtil(this.debtor._id, offSet);

    if (hasCycle) return Object.keys(this.recStack);

    return [];
  }

  private detectCycleUtil(node: string, offSet: number = 0) {
    // If node isn't visited yet
    if (!this.visited[node]) {
      // Record as visited
      this.visited[node] = true;
      this.recStack[node] = true;

      // Get all children/neighbours
      const nodeNeighbours = [...this.adjList[node]].splice(offSet);

      for (const neighbour of nodeNeighbours) {
        // Check if current neighbour has been visited yet
        // If it hasn't, call try to detect a cycle in neighbour recursively
        if (!this.visited[neighbour] && this.detectCycleUtil(neighbour)) {
          return true;
        } else if (this.recStack[neighbour]) {
          return true;
        }
      }
    }

    this.recStack[node] = false; // If node already visited, pop of recStack (we dont care about this node)
    return false;
  }

  private async initAdjList() {
    this.allUsers = await User.find();
    const allFavours = await Favour.find();

    this.allUsers.forEach((user) => {
      this.adjList[user._id] = [];
    });

    allFavours.forEach((favour) => {
      const personOwing = favour.debtor._id;
      const personReceiving = favour.recipient._id;

      const owedList = this.adjList[personOwing];

      const exists = owedList.some((arrayElement) => personReceiving === arrayElement);

      if (!exists) {
        owedList.push(personReceiving);
        this.adjList[personOwing] = owedList;
      }
    });

    return this.adjList;
  }
}

/**
 * for each child of debtor
 * detect cycle
 * if cycle
 * check if recipient in cycle
 * if recipient not in cycle
 * go next debtor child
 */
