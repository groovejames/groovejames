package groovejames.model;

public interface Relevance {

    /** get relevance, a value between 0.0 and 1.0, or {@code null} if popularity is unknown */
    Double getRelevance();

    /**
     * Set popularity
     *
     * @param relevance must be either {@code null} or a value between 0.0 and 1.0 (inclusive)
     */
    void setRelevance(Double relevance);

}
