import React from "react";
import { withTranslation } from "react-i18next";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
      debugging: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.log(error, errorInfo);
  }

  render() {
    const { t } = this.props;
    const { hasError, errorInfo, debugging } = this.state;

    if (hasError) {
      return (
        <div>
          <h2>{t("somethingWentWrong")}</h2>
          <p>{t("contactNetworkOrganizers")}</p>
          {debugging ? (
            errorInfo && (
              <pre
                dangerouslySetInnerHTML={{
                  __html: this.state.error.toString()
                }}
              />
            )
          ) : (
            <a
              href="#debugging"
              onClick={() => this.setState({ debugging: true })}
            >
              {this.props.t("showDebugging")}
            </a>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
