package wordcount;

public class Pair<T, U> {

    private T elem1;
    private U elem2;

    public Pair(T elem1, U elem2) {
        this.elem1 = elem1;
        this.elem2 = elem2;
    }

    public T getElem1() {
        return elem1;
    }

    public void setElem1(T elem1) {
        this.elem1 = elem1;
    }

    public U getElem2() {
        return elem2;
    }

    public void setElem2(U elem2) {
        this.elem2 = elem2;
    }

    @Override
    public String toString() {
        return String.format("(%s, %s)", elem1, elem2);
    }
}
