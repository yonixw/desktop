export class AddTabStore {
  public left = 0;

  public ref: HTMLDivElement;

  public setLeft(left: number, animation: boolean) {
    this.ref.style.transform = `translateX(${left}px)`;
    this.left = left;
  }
}
