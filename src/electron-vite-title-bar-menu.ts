import './electron-vite-title-bar-interfaces'

// SVG Path value of icon for indicate has sub menu
const expandSubMenuSvgPath: string = 'M543.846-480.231 353.538-671.308l22.231-22.231 212.539 213.308-212.539 212.539-22.231-22.231 190.308-190.308Z'
// SVG Path value of icon for indicate collapsed menu
const collapseMenuSvgPath: string = 'M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z'

class ElectronViteTitleBarMenu {
  private static instance: ElectronViteTitleBarMenu
  private static initialized: Boolean = false
  private static container: HTMLElement | undefined
  private static frameContainer: HTMLElement | undefined
  private static titleContainer: HTMLElement | undefined
  private static emitter: any | undefined
  private _container: HTMLElement
  private _frameContainer: HTMLElement
  private _titleContainer: HTMLElement
  private _emitter: any
  private _isMenuActivated: Boolean
  private _menuList: Array<MenuInfo>
  private _menuMap: Map<String, MenuInfo>

  public static initialize (container: HTMLElement, frameContainer: HTMLElement, titleContainer: HTMLElement, emitter: any): void {
    this.container = container
    this.frameContainer = frameContainer
    this.titleContainer = titleContainer
    this.emitter = emitter
    ElectronViteTitleBarMenu.initialized = true
  }

  public static getInstance (): ElectronViteTitleBarMenu {
    if (!ElectronViteTitleBarMenu.initialized ||
      this.container == undefined ||
      this.frameContainer == undefined ||
      this.titleContainer == undefined ||
      this.emitter == undefined) {
      throw TypeError('ElectronViteTitleBarMenu is not initaizlied')
    }
    if (!ElectronViteTitleBarMenu.instance) {
      ElectronViteTitleBarMenu.instance = new ElectronViteTitleBarMenu(this.container, this.frameContainer, this.titleContainer, this.emitter)
    }
    return ElectronViteTitleBarMenu.instance
  }

  constructor (container: HTMLElement, frameContainer: HTMLElement, titleContainer: HTMLElement, emitter: any) {
    this._container = container
    this._frameContainer = frameContainer
    this._titleContainer = titleContainer
    this._emitter = emitter
    this._isMenuActivated = false
    this._menuList = new Array<MenuInfo>()
    this._menuMap = new Map<String, MenuInfo>()
  }
  
  
  /**
   * Setting menu infomation and validate.
   * @param {list of menu info that is consist of JSON Array} menuList 
   */
  public setMenuInfo = (menuList: Array<MenuInfo>): void => {
    for (let index = 0; index < menuList.length; index++) {
      const menuInfo = menuList[index]
      const validation = this.validateMenuInfo(menuInfo)
      if (!validation.success) {
        console.error(validation.error, menuInfo)
        return
      } else {
        if (!menuInfo.id) {
          menuInfo.id = 'evtb-menu-item-' + (index + 1) + '-0'
        }
        if (menuInfo.disabled == undefined) {
          menuInfo.disabled = false
        }
        this._menuMap.set(menuInfo.id, menuInfo)
      }

      if (menuInfo.hotKey) {
        const validation = this.addHotkeyEventListener(menuInfo)
        if (!validation.success) {
          console.error(validation.error, validation.menuInfo)
          return
        }
      }

      if (menuInfo.subMenu != undefined) {
        for (let subIndex = 0; subIndex < menuInfo.subMenu.length; subIndex++) {
          const subMenuInfo = menuInfo.subMenu[subIndex]
          const validation = this.validateMenuInfo(subMenuInfo)
          if (!validation.success) {
            console.error(validation.error, subMenuInfo)
            return
          } else {
            if (!subMenuInfo.id) {
              subMenuInfo.id = 'evtb-menu-item-' + (index + 1) + '-' + (subIndex + 1)
            }
            if (subMenuInfo.disabled == undefined) {
              subMenuInfo.disabled = false
            }
            this._menuMap.set(subMenuInfo.id, subMenuInfo)
          }

          if (subMenuInfo.hotKey) {
            const validation = this.addHotkeyEventListener(subMenuInfo)
            if (!validation.success) {
              console.error(validation.error, validation.menuInfo)
              return
            }
          }
        }
      }
    }
    
    this._menuList = menuList
  }

  /**
   * Validate menu information.
   * @param {menu info that is consist of JSON} menuInfo 
   * @returns 
   */
  private validateMenuInfo (menuInfo: MenuInfo): MenuValidation {
    if (menuInfo.label == undefined && !menuInfo.separator) {
      return {
        success: false,
        error: 'menuInfo needs { label: \'labelName\' } or { separator: true }'
      }
    } else if (menuInfo.label != undefined && menuInfo.separator) {
      return {
        success: false,
        error: 'menuInfo can\'t have both \'label\' and \'separator\''
      }
    }

    if (menuInfo.separator) return { success: true }
    if (menuInfo.hotKey != undefined && menuInfo.subMenu != undefined) {
      return {
        success: false,
        error: 'menuInfo can\'t have both \'hotKey\' and \'subMenu\''
      }
    }

    return { success: true }
  }

  /**
   * Create root menu items.
   */
  public createRootMenu = (): void => {
    const rootGroup = this._container.querySelector('ul.evtb-menu-group[level="0"]')
    if (rootGroup != null) {
      rootGroup.remove()
    }

    const group = this.createMenuGroup(0)
    this._container.appendChild(group)

    let index: number = 0
    const frameContainerWidth: number = this._frameContainer.getBoundingClientRect().width

    if (frameContainerWidth > 480) {
      for (index; index < this._menuList.length; index++) {
        const menuItem = this.createMenuItem(0, this._menuList[index])
        group.appendChild(menuItem)
  
        const menuContainerWidth = this._container.getBoundingClientRect().width
        const menuContainerX = this._container.getBoundingClientRect().x
        const titleContainerX = this._titleContainer.getBoundingClientRect().x
        const titleContainerVisible = this._titleContainer.clientWidth > 0

        // If overlap elements menu container and title container when create menu. 
        if (titleContainerVisible && (menuContainerWidth + menuContainerX) >= (titleContainerX - 20)) {
          // Delete the second node from the end to make space for the collapse menu.
          group.removeChild(menuItem)
          if (group.hasChildNodes() && group.lastChild) {
            group.removeChild(group.lastChild)
          }
          index--
          break;
        }
      }
    }

    // If when create menu, doesn't created all menu
    // create collapse menu includes all remain menu by menu item.
    if (index != this._menuList.length) {
      const collapseElement = document.createElement('li')
      collapseElement.setAttribute('type', 'menu')
      collapseElement.classList.add('evtb-menu-item-0')
      collapseElement.classList.add('collapse')
      collapseElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48"><path d="' + collapseMenuSvgPath + '"/></svg>'
      group.appendChild(collapseElement)

      const collapseMenu: CollapseMenuInfo = {
        label: '',
        subMenu: []
      }

      for (index; index < this._menuList.length; index++) {
        collapseMenu.subMenu.push(this._menuList[index])
      }

      this.addMenuClickListener(collapseElement, 0, collapseMenu)
      this.addMenuOverListener(collapseElement, 0, collapseMenu)
    }

    this.addMenuDestroyListener()
  }

  /**
   * Created submenu when a specific menu is clicked.
   * @param {<ul> element that clicked} parentElement 
   * @param {level of menu} level 
   * @param {submenu list} subMenuList 
   */
  private createMenu (parentElement: HTMLLIElement, level: number, subMenuList: Array<MenuInfo>): void {
    const group = this.createMenuGroup(level)
    group.style.visibility = 'hidden'
    this._container.appendChild(group)
    
    // When selected menu is changed
    // add .selected class to the selected menu and remove .selected class from previous selected menu
    if (level > 0) {
      this.setMenuSelected(level - 1, parentElement)
    }

    subMenuList.forEach(subMenuInfo => {
      const element = this.createMenuItem(level, subMenuInfo)
      group.appendChild(element)
    })

    // When parentElement is not null
    // submenu group element set position as right side of parentElement
    if (parentElement) {
      this.adjustGroupPosition(parentElement, level, group)
    }

    group.style.visibility = ''
  }

  /**
   * Create an <ul> element to contains <li> element which is menu items.
   * @param {level of menu} level 
   * @returns <ul> element
   */
  private createMenuGroup (level: number): HTMLUListElement {
    const group = document.createElement('ul')
    group.setAttribute('level', String(level))
    group.classList.add('evtb-menu-group')
    return group
  }

  /**
   * Close all groups of menu more then level
   * @param {level of menu} level 
   */
  private destroyMenuGroup (level: number): void {
    const groups = this._container.querySelectorAll('ul.evtb-menu-group')
    groups.forEach(group => {
      const groupLevel = Number(group.getAttribute('level'))
      if (groupLevel >= level) {
        if (groupLevel == 1) {
          // 메뉴의 레벨이 1이고, 삭제 대상인 경우
          // 루트메뉴의 selected 클래스를 모두 삭제하여 초기화한다.
          this.setMenuSelected(0, null)
        }
        group.remove()
      }
    })
  }

  /**
   * Adjust position of group element based on parentElement.
   * @param {<ul> element that clicked} parentElement 
   * @param {level of menu} level 
   * @param {<ul> element for constain <li> element which is menu items.} group 
   */
  private adjustGroupPosition (parentElement: HTMLLIElement, level: number, group: HTMLUListElement) {
    let top = 0
    let left = 0

    if (level == 1) {
      top = parentElement.getBoundingClientRect().height
      left = parentElement.getBoundingClientRect().x
    } else if (level > 1) {
      // 메뉴그룹의 상단 패딩값 5px 만큼 빼준다.
      top = (parentElement.getBoundingClientRect().y - 5)
      left = parentElement.getBoundingClientRect().x + parentElement.getBoundingClientRect().width
    }

    // 하위 메뉴의 우측변 X 값이 프레임을 벗어나는 경우
    if (left + group.clientWidth > window.innerWidth) {
      if (window.innerWidth - left < group.clientWidth) {
        left = window.innerWidth - group.clientWidth
      } else {
        left -= (left - window.innerWidth)
      }

      // Margin
      left -= 10
      top += 10
    }

    group.style.top = Math.floor(top) + 'px'
    group.style.left = left + 'px'
  }

  /**
   * Create an <li> element which represents menu.
   * @param {level of menu} level 
   * @param {information of menu} menuInfo 
   * @returns <li> Element
   */
  private createMenuItem (level: number, menuInfo: MenuInfo): HTMLElement {
    const element = document.createElement('li')
    if (menuInfo.separator) {
      element.setAttribute('type', 'separator')
    }

    if (menuInfo.label) {
      element.setAttribute('type', 'menu')
      element.setAttribute('value', menuInfo.label)
      element.classList.add('evtb-menu-item-' + level)
      element.innerHTML = '<span class="evtb-menu-item-label">' + menuInfo.label + '</span>'

      // 레벨 1이상의 메뉴에서 하위 메뉴가 있을 경우
      // 하위 메뉴가 있다는 아이콘을 추가해준다.
      if (level >= 1 && menuInfo.subMenu != undefined) {
        element.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="48" height="48"><path d="' + expandSubMenuSvgPath + '"/></svg>'
      } else if (level >= 1 && menuInfo.hotKey != undefined) {
        element.innerHTML += '<span class="evtb-menu-item-hotkey">' + menuInfo.hotKey + '</span>'
      }

      if (menuInfo.disabled) {
        element.classList.add('disabled')
      } else {
        this.addMenuOverListener(element, level, menuInfo)
      }
      this.addMenuClickListener(element, level, menuInfo)
    }
    return element
  }

  /**
   * Add hotkey event to execute menu when user press hotkey on application.
   * @param {information of menu} menuInfo 
   * @returns 
   */
  private addHotkeyEventListener (menuInfo: MenuInfo): { success: Boolean, error?: string, menuInfo?: MenuInfo } {
    const hotKey = menuInfo.hotKey
    if (!hotKey) {
      return {
        success: false,
        error: 'hotKey 정보가 존재하지 않습니다.',
        menuInfo: menuInfo
      }
    } else {
      window.addEventListener('keydown', (e) => {
        const keys: Array<string> = hotKey.split('+')
        let hasCtrl: boolean = false
        let hasAlt: boolean = false
        let hasShift: boolean = false
        
        if (keys.includes('Ctrl')) {
          hasCtrl = true
          keys.splice(keys.indexOf('Ctrl'), 1)
        }
        if (keys.includes('Alt')) {
          hasAlt = true
          keys.splice(keys.indexOf('Alt'), 1)
        }
        if (keys.includes('Shift')) {
          hasShift = true
          keys.splice(keys.indexOf('Shift'), 1)
        }

        if (keys.length < 1) {
          console.error(`hotkey doesn't have key without Ctrl, Alt, Shift`, menuInfo)
        }

        if (e.ctrlKey == hasCtrl && e.altKey == hasAlt && e.shiftKey == hasShift && e.key.toUpperCase() == keys[0].toUpperCase()) {
          e.preventDefault()
          this.destroyMenuGroup(1)
          this._isMenuActivated = false
          this._emitter('onMenuClick', menuInfo.id, menuInfo.label)
        }
      })
    }

    return { success: true }
  }

  /**
   * Add event to execute menu clicked or create submenu when user click menu item.
   * @param {<li> element of menu that user clicked} menuElement 
   * @param {level of menu} level 
   * @param {information of menu} menuInfo 
   */
  private addMenuClickListener (menuElement: HTMLLIElement, level: number, menuInfo: MenuInfo): void {
    menuElement.addEventListener('click', (e) => {
      e.stopPropagation()
      if (menuInfo.subMenu != undefined) {
        const selectedElement = this.getMenuSelected(level)
        // 루트 메뉴인 경우 한번 더 클릭하면 메뉴를 비활성화한다.
        if (menuElement == selectedElement && level == 0) {
          this.destroyMenuGroup(1)
          this.setMenuSelected(level, null)
          this._isMenuActivated = false
        } else {
          // 하위 메뉴가 있을 경우 하위 메뉴를 생성한다.
          this.destroyMenuGroup(level + 1)
          this.createMenu(menuElement, level + 1, menuInfo.subMenu)
          this._isMenuActivated = true
        }
      } else if (!menuInfo.disabled) {
        // 하위 메뉴가 없을 경우 클릭 이벤트를 발생시킨다.
        this.destroyMenuGroup(1)
        this._isMenuActivated = false
        this._emitter('onMenuClick', menuInfo.id, menuInfo.label)
      }
    })
  }

  /**
   * Add event that creates a submenu when a mouseover event occurs while the menu is active.
   * @param {<li> element of menu that user clicked} menuElement 
   * @param {level of menu} level 
   * @param {information of menu} menuInfo 
   */
  private addMenuOverListener (menuElement: HTMLLIElement, level: number, menuInfo: MenuInfo): void {
    menuElement.addEventListener('mouseover', (e) => {
      e.stopPropagation()
      if (!this._isMenuActivated) return
      this.destroyMenuGroup(level + 1)
      if (menuInfo.subMenu != undefined) {
        this.createMenu(menuElement, level + 1, menuInfo.subMenu)
      }
    })
  }

  /**
   * Add event to close the menu when user clicks outside the menu.
   */
  private addMenuDestroyListener (): void {
    document.addEventListener('click', (e) => {
      let isMenuClicked: Boolean = false
      const groups: NodeListOf<HTMLElement> = this._container.querySelectorAll('ul.evtb-menu-group:not([level="0"])')

      groups.forEach(group => {
        if (e.target == group) {
          isMenuClicked = true
        }
      })
      
      if (!isMenuClicked) {
        this.destroyMenuGroup(1)
        this._isMenuActivated = false
      }
    })

    window.addEventListener('resize', () => {
      this.destroyMenuGroup(1)
      this._isMenuActivated = false
    })
  }

  /**
   * Add .selected class to the selected menu and remove .selected class from previous selected menu
   * @param {level of menu} level 
   * @param {<li> element that clicked} clickedElement 
   */
  private setMenuSelected (level: number, clickedElement: HTMLElement | null): void {
    const elements = this._container.querySelectorAll('li.evtb-menu-item-' + level)
    elements.forEach(li => {
      // 클릭한 메뉴 객체가 아닌데 selected 클래스가 있을 경우 제거한다.
      if (li != clickedElement && li.classList.contains('selected')) {
        li.classList.remove('selected')
      }
      // 클릭한 메뉴 객체인데 selected 클래스가 없을 경우 추가한다.
      if (li == clickedElement && !li.classList.contains('selected')) {
        li.classList.add('selected')
      }
    })
  }

  /**
   * Return <li> element that has .selected class.
   * @param {level of menu} level 
   * @returns <li> element
   */
  private getMenuSelected (level: number): HTMLElement | null {
    return this._container ? this._container.querySelector('li.evtb-menu-item-' + level + '.selected') : null
  }

  public getMenuList = (): Array<MenuInfo> => {
    return this._menuList
  }

  public getMenuInfo = (id: string): MenuInfo | undefined => {
    return this._menuMap.get(id)
  }

  public setMenuDisabled = (id: string, disabled: Boolean): void => {
    const menuInfo = this._menuMap.get(id)
    if (menuInfo) {
      menuInfo.disabled = disabled
    }
  }

  public getMenuDisabled = (id: string): Boolean | undefined => {
    const menuInfo = this._menuMap.get(id)
    if (menuInfo) {
      return menuInfo.disabled
    } else {
      return undefined
    }
  }
}

export default ElectronViteTitleBarMenu