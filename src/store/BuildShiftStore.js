import { observable, action } from 'mobx'

export class BuildShiftStore {

    constructor() {
        this.arrSubmittedShifts = null
        this.arrShifts = []
        this.arrShiftSketch = []
        this.isReady = false // for loader
        this.usersShiftObserver = {}
        this.isSubmitShiftFull = false
    }

    @observable submittedShifts
    @observable arrUsers
    @observable arrShiftSketch
    @observable isReady
    @observable usersShiftObserver
    @observable isSubmitShiftFull

    @action initBuildStore = (length, arrUsers, arrShifts) => {

        this.arrShifts = arrShifts
        let listOfOptions = Object.keys(this.arrShifts[0].arrOptions[0])
        this.initSubmittedShifts(length, listOfOptions)
        this.initUsers(arrUsers)
        this.initUserShiftObserver()
    }

    @action submitShifts = () => {

        console.log(this.arrSubmittedShifts)
        console.log(this.arrUsers)
        console.log(this.usersShiftObserver)
        this.checkIfSubmitShiftFull()
    }

    @action checkIfSubmitShiftFull = () => {

        let dayOptions = Object.keys(this.arrSubmittedShifts[0])
        let curShift, curDayOption, isSomewhereMissingWorker = false
        for (let i = 0; i < this.arrSubmittedShifts.length; i++) {
            curShift = this.arrSubmittedShifts[i]
            for (let j = 0; j < dayOptions.length; j++) {
                curDayOption = dayOptions[j]
                if (curShift[curDayOption] == null) {
                    isSomewhereMissingWorker = true
                    break;
                }
            }
        }
        this.isSubmitShiftFull = isSomewhereMissingWorker ? false : true
    }

    @action chooseUser = (user, shift, dayIndex) => {

        this.arrSubmittedShifts[dayIndex][shift] = user
        this.updateUsersShifts()
        this.createaDataToChart()
    }

    @action createaDataToChart = () => {
        let arrUsers = []
        for (let i = 0; i < this.arrUsers.length; i++) {
            for (let j = 0; j < this.arrShifts.length; j++) {
                if (this.arrUsers[j].user === this.arrShifts[i].user)
                    arrUsers.push({
                        user: this.arrShifts[j].user,
                        fullName: this.arrUsers[i].fullName,
                        numOfWantedShifts: this.arrShifts[i].numOfWantedShifts,
                        numOfCurrentShifts: this.usersShiftObserver[this.arrShifts[i].user]
                    })
            }
        }
        this.arrUsers = arrUsers
    }

    @action updateUsersShifts = () => {

        this.initUserShiftObserver()
        let dayOptions = Object.keys(this.arrSubmittedShifts[0])
        let curShift, curDayOption

        for (let i = 0; i < this.arrSubmittedShifts.length; i++) {
            curShift = this.arrSubmittedShifts[i]
            for (let j = 0; j < dayOptions.length; j++) {
                curDayOption = dayOptions[j]
                if (curShift[curDayOption] != null) {
                    let curUser = curShift[curDayOption]
                    this.usersShiftObserver[curUser]++
                }
            }
        }
    }

    @action initUserShiftObserver = () => {

        let users = this.arrUsers.map(u => { return { user: u.user, numOfCurrentShifts: 0 } })
        for (let i = 0; i < users.length; i++)
            this.usersShiftObserver[users[i].user] = users[i].numOfCurrentShifts
    }

    @action initUsers = (users) => {

        this.arrUsers = []
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < this.arrShifts.length; j++) {
                if (users[j].user === this.arrShifts[i].user)
                    this.arrUsers.push({
                        user: this.arrShifts[j].user,
                        fullName: users[i].name.split("")[0] + "." + users[i].lastName,
                        numOfWantedShifts: this.arrShifts[i].numOfWantedShifts,
                        numOfCurrentShifts: 0
                    })
            }
        }
    }

    @action initSubmittedShifts = (length, listOfOptions) => {

        if (this.arrSubmittedShifts == null) {
            this.arrSubmittedShifts = []
            for (let i = 0; i < length; i++) {
                let optionsModel = {}
                listOfOptions.forEach(opt => optionsModel[opt] = null)
                this.arrSubmittedShifts.push(optionsModel)
            }
        }
    }
}