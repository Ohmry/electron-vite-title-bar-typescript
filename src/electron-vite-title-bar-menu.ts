// 해당 메뉴에 하위 메뉴가 존재할 때, 하위 메뉴가 있음을 표시하기 위한 아이콘의 SVG Path 값
const expandSubMenuSvgPath: string = 'M543.846-480.231 353.538-671.308l22.231-22.231 212.539 213.308-212.539 212.539-22.231-22.231 190.308-190.308Z'
// 루트 메뉴를 생성할 때, 메뉴의 너비가 부족하여 일부를 Collapse 했을 때, 표시하기 위한 아이콘의 SVG Path 값
const collapseMenuSvgPath: string = 'M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z'

class ElectronViteTitleBarMenu {
  private container: HTMLElement | undefined
  private framContainer: HTMLElement | undefined
  private titleContainer: HTMLElement | undefined
  private isMenuActivated: Boolean = false
  private emit: Event | undefined

  constructor () {
    this.container = undefined
    this.framContainer = undefined
    this.titleContainer = undefined
    this.isMenuActivated = false
    this.emit = undefined
  }

  /**
   * 메뉴를 생성하기 위해 객체에 필요한 정보를 초기화한다.
   * @param container 메뉴 컨테이너
   * @param framContainer 프레임 컨테이너
   * @param titleContainer 타이틀 컨테이너
   * @param emit 클릭 함수를 발생시킬 Emit
   */
  public initialize (container: HTMLElement, framContainer: HTMLElement, titleContainer: HTMLElement, emit: Event) {
    this.container = container
    this.framContainer = framContainer
    this.titleContainer = titleContainer
    this.emit = emit
  }


}