export interface CustomChatSettings {
  /**
   * The unique ID of the end user, helps the platform intervene in illegal activities, generate illegal or improper information, or other abuse by the end user.
   * ID length requirement: at least 6 characters, up to 128 characters.
   */
  userId?: string;
  /**
   * The unique ID of the request, passed by the user side, must be unique;
   * The platform will generate one by default if not provided by the user side.
   */
  requestId?: string;
  /**
   * When do_sample is true, sampling strategy is enabled, when do_sample is false, the sampling strategy temperature, top_p will not take effect
   */
  doSample?: boolean;
}
